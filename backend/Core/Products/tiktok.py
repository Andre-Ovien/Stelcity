import logging
from decimal import Decimal

import requests
from django.conf import settings
from django.utils import timezone

from .models import Product


logger = logging.getLogger(__name__)


class TikTokEventsAPIError(RuntimeError):
    """Raised when a TikTok Events API event could not be delivered."""


def _number(value):
    if isinstance(value, Decimal):
        return float(value)
    return value


def build_purchase_event(payment, event_time=None):
    order = payment.order
    contents = []

    for item in order.items.select_related('product').all():
        category = (
            'raw_material'
            if item.product.category == Product.CategoryChoices.RAW_MATERIAL
            else 'skincare'
        )
        contents.append({
            'content_id': str(item.product_id),
            'content_type': 'product',
            'content_name': item.product.name,
            'content_category': category,
            'quantity': item.quantity,
            'price': _number(item.price),
        })

    occurred_at = event_time or timezone.now()
    event = {
        'event': 'Purchase',
        'event_time': int(occurred_at.timestamp()),
        'event_id': f'purchase:{order.order_id}',
        # The API accepts match keys, but Stelcity deliberately sends no PII here.
        'user': {},
        'page': {
            'url': f"{settings.FRONTEND_URL.rstrip('/')}/payment/verify",
        },
        'properties': {
            'contents': contents,
            'content_type': 'product',
            'value': _number(payment.amount),
            'currency': 'NGN',
            'order_id': str(order.order_id),
        },
    }
    return event


def build_purchase_payload(payment, event_time=None):
    payload = {
        'event_source': 'web',
        'event_source_id': settings.TIKTOK_PIXEL_ID,
        'data': [build_purchase_event(payment, event_time=event_time)],
    }

    test_event_code = settings.TIKTOK_EVENTS_API_TEST_CODE.strip()
    if test_event_code:
        payload['test_event_code'] = test_event_code

    return payload


def send_purchase_event(payment, event_time=None):
    pixel_id = settings.TIKTOK_PIXEL_ID.strip()
    access_token = settings.TIKTOK_EVENTS_API_ACCESS_TOKEN.strip()
    if not pixel_id or not access_token:
        raise TikTokEventsAPIError('TikTok Events API is not configured.')

    try:
        response = requests.post(
            settings.TIKTOK_EVENTS_API_URL,
            headers={
                'Access-Token': access_token,
                'Content-Type': 'application/json',
            },
            json=build_purchase_payload(payment, event_time=event_time),
            timeout=settings.TIKTOK_EVENTS_API_TIMEOUT,
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        raise TikTokEventsAPIError(
            'TikTok Events API request failed.'
        ) from exc

    if response.status_code != requests.codes.ok:
        raise TikTokEventsAPIError(
            'TikTok Events API did not confirm delivery.'
        )

    try:
        response_data = response.json()
    except ValueError as exc:
        raise TikTokEventsAPIError(
            'TikTok Events API returned an invalid response.'
        ) from exc

    if response_data.get('code') != 0:
        logger.error(
            'TikTok Events API rejected Purchase event: code=%s request_id=%s',
            response_data.get('code'),
            response_data.get('request_id'),
        )
        raise TikTokEventsAPIError('TikTok Events API rejected the event.')

    return response_data
