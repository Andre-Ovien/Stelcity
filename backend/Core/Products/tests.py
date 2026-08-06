import hashlib
import hmac
import json
from datetime import datetime, timezone as datetime_timezone
from decimal import Decimal
from unittest.mock import Mock, patch

import requests
from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings

from .models import Order, OrderItem, Payment, Product
from .tiktok import (
    TikTokEventsAPIError,
    build_purchase_payload,
    send_purchase_event,
)


class PurchaseFixtureMixin:
    def create_purchase(self):
        user = get_user_model().objects.create_user(
            email='buyer@example.com',
            password='StrongPassword123!',
            full_name='Test Buyer',
            phone_number='+2348000000000',
        )
        skincare = Product.objects.create(
            category=Product.CategoryChoices.PRODUCT,
            name='Acne cream',
            description='Test skincare product',
            price=Decimal('5000.00'),
        )
        raw_material = Product.objects.create(
            category=Product.CategoryChoices.RAW_MATERIAL,
            name='Shea butter',
            description='Test raw material',
            price=None,
        )
        order = Order.objects.create(
            user=user,
            delivery_fee=Decimal('1000.00'),
        )
        OrderItem.objects.create(
            order=order,
            product=skincare,
            quantity=2,
            price=Decimal('5000.00'),
        )
        OrderItem.objects.create(
            order=order,
            product=raw_material,
            quantity=1,
            price=Decimal('2500.00'),
        )
        payment = Payment.objects.create(
            order=order,
            reference='SQUAD-REFERENCE',
            amount=Decimal('13500.00'),
        )
        return payment


@override_settings(
    FRONTEND_URL='https://www.stelcity.com',
    TIKTOK_PIXEL_ID='D9IUH3JC77U7JAF0U2N0',
    TIKTOK_EVENTS_API_TEST_CODE='',
)
class TikTokPurchasePayloadTests(PurchaseFixtureMixin, TestCase):
    def test_purchase_payload_uses_order_snapshots_and_contains_no_customer_pii(self):
        payment = self.create_purchase()
        occurred_at = datetime(2026, 8, 4, 12, 30, tzinfo=datetime_timezone.utc)

        payload = build_purchase_payload(payment, event_time=occurred_at)

        self.assertEqual(payload['event_source'], 'web')
        self.assertEqual(payload['event_source_id'], 'D9IUH3JC77U7JAF0U2N0')
        self.assertNotIn('test_event_code', payload)

        event = payload['data'][0]
        self.assertEqual(event['event'], 'Purchase')
        self.assertEqual(event['event_time'], 1785846600)
        self.assertEqual(
            event['event_id'],
            f'purchase:{payment.order.order_id}',
        )
        self.assertEqual(event['user'], {})
        self.assertEqual(
            event['page']['url'],
            'https://www.stelcity.com/payment/verify',
        )
        self.assertEqual(event['properties']['currency'], 'NGN')
        self.assertEqual(event['properties']['value'], 13500.0)
        self.assertEqual(event['properties']['content_type'], 'product')
        self.assertEqual(len(event['properties']['contents']), 2)
        self.assertEqual(
            event['properties']['content_ids'],
            [
                str(item.product_id)
                for item in payment.order.items.order_by('id')
            ],
        )
        self.assertEqual(
            event['properties']['contents'][0],
            {
                'content_id': str(payment.order.items.first().product_id),
                'content_type': 'product',
                'content_name': 'Acne cream',
                'content_category': 'skincare',
                'quantity': 2,
                'price': 5000.0,
            },
        )
        self.assertEqual(
            event['properties']['contents'][1]['content_category'],
            'raw_material',
        )

        serialized = json.dumps(payload)
        self.assertNotIn('buyer@example.com', serialized)
        self.assertNotIn('+2348000000000', serialized)
        self.assertNotIn('Test Buyer', serialized)

    @override_settings(TIKTOK_EVENTS_API_TEST_CODE='TEST123')
    def test_test_event_code_is_only_included_when_configured(self):
        payment = self.create_purchase()

        payload = build_purchase_payload(payment)

        self.assertEqual(payload['test_event_code'], 'TEST123')

    def test_purchase_payload_rejects_an_order_without_items(self):
        payment = self.create_purchase()
        payment.order.items.all().delete()

        with self.assertRaisesMessage(
            TikTokEventsAPIError,
            'TikTok Purchase events require at least one order item.',
        ):
            build_purchase_payload(payment)


@override_settings(
    TIKTOK_PIXEL_ID='D9IUH3JC77U7JAF0U2N0',
    TIKTOK_EVENTS_API_ACCESS_TOKEN='secret-token',
    TIKTOK_EVENTS_API_URL='https://business-api.tiktok.com/open_api/v1.3/event/track/',
    TIKTOK_EVENTS_API_TIMEOUT=5.0,
    TIKTOK_EVENTS_API_TEST_CODE='',
)
class TikTokEventsClientTests(PurchaseFixtureMixin, TestCase):
    @patch('Products.tiktok.requests.post')
    def test_sender_uses_access_token_timeout_and_requires_code_zero(self, post):
        payment = self.create_purchase()
        response = Mock()
        response.status_code = 200
        response.json.return_value = {
            'code': 0,
            'message': 'OK',
            'request_id': 'request-id',
            'data': {},
        }
        post.return_value = response

        result = send_purchase_event(payment)

        self.assertEqual(result['code'], 0)
        _, kwargs = post.call_args
        self.assertEqual(kwargs['headers']['Access-Token'], 'secret-token')
        self.assertEqual(kwargs['headers']['Content-Type'], 'application/json')
        self.assertEqual(kwargs['timeout'], 5.0)
        self.assertEqual(kwargs['json']['data'][0]['event'], 'Purchase')
        response.raise_for_status.assert_called_once_with()

    @patch('Products.tiktok.requests.post')
    def test_sender_rejects_nonzero_api_code(self, post):
        payment = self.create_purchase()
        response = Mock()
        response.status_code = 200
        response.json.return_value = {
            'code': 40002,
            'message': 'Invalid parameters',
            'request_id': 'request-id',
        }
        post.return_value = response

        with self.assertRaises(TikTokEventsAPIError):
            send_purchase_event(payment)

    @patch('Products.tiktok.requests.post')
    def test_sender_requires_http_200_even_when_body_code_is_zero(self, post):
        payment = self.create_purchase()
        response = Mock()
        response.status_code = 202
        response.json.return_value = {'code': 0, 'message': 'OK'}
        post.return_value = response

        with self.assertRaises(TikTokEventsAPIError):
            send_purchase_event(payment)

    @patch('Products.tiktok.requests.post')
    def test_sender_wraps_network_failure(self, post):
        payment = self.create_purchase()
        post.side_effect = requests.Timeout('timed out')

        with self.assertRaises(TikTokEventsAPIError):
            send_purchase_event(payment)

    @override_settings(TIKTOK_EVENTS_API_ACCESS_TOKEN='')
    def test_sender_requires_configuration(self):
        payment = self.create_purchase()

        with self.assertRaises(TikTokEventsAPIError):
            send_purchase_event(payment)

    @patch('Products.tiktok.requests.post')
    def test_sender_does_not_send_an_empty_purchase(self, post):
        payment = self.create_purchase()
        payment.order.items.all().delete()

        with self.assertRaises(TikTokEventsAPIError):
            send_purchase_event(payment)

        post.assert_not_called()


@override_settings(
    SQUAD_SECRET_KEY='squad-webhook-secret',
    TIKTOK_PIXEL_ID='D9IUH3JC77U7JAF0U2N0',
    TIKTOK_EVENTS_API_ACCESS_TOKEN='secret-token',
)
class SquadWebhookTikTokTests(PurchaseFixtureMixin, TestCase):
    webhook_url = '/api/products/payment/webhook/'

    def setUp(self):
        self.payment = self.create_purchase()

    def verification(self, **overrides):
        data = {
            'transaction_status': 'Success',
            'transaction_ref': self.payment.reference,
            'transaction_currency_id': 'NGN',
            'transaction_amount': 1350000,
        }
        data.update(overrides)
        return {'status': 200, 'success': True, 'data': data}

    def signed_webhook(self, signature=None):
        payload = {
            'Event': 'charge_successful',
            'Body': {'transaction_ref': self.payment.reference},
        }
        raw_body = json.dumps(payload, separators=(',', ':')).encode('utf-8')
        valid_signature = hmac.new(
            b'squad-webhook-secret',
            raw_body,
            hashlib.sha512,
        ).hexdigest().upper()
        return self.client.post(
            self.webhook_url,
            data=raw_body,
            content_type='application/json',
            HTTP_X_SQUAD_ENCRYPTED_BODY=signature or valid_signature,
        )

    @patch('Products.views.send_order_confirmation')
    @patch('Products.views.create_notification')
    @patch('Products.views.send_purchase_event')
    @patch('Products.views.verify_squad_payment')
    def test_verified_success_confirms_order_and_sends_purchase(
        self,
        verify,
        send_purchase,
        notify,
        send_email,
    ):
        verify.return_value = self.verification()

        response = self.signed_webhook()

        self.assertEqual(response.status_code, 200)
        self.payment.refresh_from_db()
        self.payment.order.refresh_from_db()
        self.assertEqual(self.payment.status, Payment.StatusChoices.SUCCESS)
        self.assertEqual(self.payment.order.status, Order.StatusChoices.CONFIRMED)
        send_purchase.assert_called_once()
        self.assertEqual(
            send_purchase.call_args.args[0].order.order_id,
            self.payment.order.order_id,
        )
        notify.assert_called_once()
        send_email.assert_called_once()

    @patch('Products.views.send_order_confirmation')
    @patch('Products.views.create_notification')
    @patch('Products.views.send_purchase_event')
    @patch('Products.views.verify_squad_payment')
    def test_verified_duplicate_does_not_resend_event_or_messages(
        self,
        verify,
        send_purchase,
        notify,
        send_email,
    ):
        verify.return_value = self.verification()

        first_response = self.signed_webhook()
        second_response = self.signed_webhook()

        self.assertEqual(first_response.status_code, 200)
        self.assertEqual(second_response.status_code, 200)
        send_purchase.assert_called_once()
        notify.assert_called_once()
        send_email.assert_called_once()

    @patch('Products.views.send_purchase_event')
    @patch('Products.views.verify_squad_payment')
    def test_amount_mismatch_does_not_confirm_or_send(self, verify, send_purchase):
        verify.return_value = self.verification(transaction_amount=1)

        response = self.signed_webhook()

        self.assertEqual(response.status_code, 400)
        self.payment.refresh_from_db()
        self.payment.order.refresh_from_db()
        self.assertEqual(self.payment.status, Payment.StatusChoices.PENDING)
        self.assertEqual(self.payment.order.status, Order.StatusChoices.PENDING)
        send_purchase.assert_not_called()

    @patch('Products.views.send_purchase_event')
    @patch('Products.views.verify_squad_payment')
    def test_inconclusive_verification_does_not_cancel_order(self, verify, send_purchase):
        verify.return_value = {
            'status': 200,
            'success': True,
            'data': {'transaction_status': 'Pending'},
        }

        response = self.signed_webhook()

        self.assertEqual(response.status_code, 503)
        self.payment.refresh_from_db()
        self.payment.order.refresh_from_db()
        self.assertEqual(self.payment.status, Payment.StatusChoices.PENDING)
        self.assertEqual(self.payment.order.status, Order.StatusChoices.PENDING)
        send_purchase.assert_not_called()

    @patch('Products.views.send_purchase_event')
    @patch('Products.views.verify_squad_payment')
    def test_non_dictionary_verification_is_treated_as_transient(self, verify, send_purchase):
        verify.return_value = None

        response = self.signed_webhook()

        self.assertEqual(response.status_code, 503)
        self.payment.refresh_from_db()
        self.payment.order.refresh_from_db()
        self.assertEqual(self.payment.status, Payment.StatusChoices.PENDING)
        self.assertEqual(self.payment.order.status, Order.StatusChoices.PENDING)
        send_purchase.assert_not_called()

    @patch('Products.views.send_order_confirmation')
    @patch('Products.views.create_notification')
    @patch('Products.views.send_purchase_event')
    @patch('Products.views.verify_squad_payment')
    def test_tiktok_failure_does_not_undo_payment_or_fail_squad_webhook(
        self,
        verify,
        send_purchase,
        notify,
        send_email,
    ):
        verify.return_value = self.verification()
        send_purchase.side_effect = TikTokEventsAPIError('temporary failure')

        first_response = self.signed_webhook()
        second_response = self.signed_webhook()

        self.assertEqual(first_response.status_code, 200)
        self.assertEqual(second_response.status_code, 200)
        self.payment.refresh_from_db()
        self.payment.order.refresh_from_db()
        self.assertEqual(self.payment.status, Payment.StatusChoices.SUCCESS)
        self.assertEqual(self.payment.order.status, Order.StatusChoices.CONFIRMED)
        send_purchase.assert_called_once()
        notify.assert_called_once()
        send_email.assert_called_once()

    @patch('Products.views.verify_squad_payment')
    def test_invalid_signature_is_rejected_before_verification(self, verify):
        response = self.signed_webhook(signature='invalid')

        self.assertEqual(response.status_code, 400)
        verify.assert_not_called()
