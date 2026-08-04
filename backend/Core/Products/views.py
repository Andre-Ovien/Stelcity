from django.shortcuts import render
from decimal import Decimal, InvalidOperation
import logging

from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from .models import ProductVariant, Product, Order, OrderItem, Payment, DeliveryZone, DeliverySettings
from .serializers import ProductVariantSerializer, ProductSerializer, OrderSerializer, CartSyncCheckoutSerializer, OrderHistorySerializer
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
import hmac, hashlib, uuid
from django.conf import settings
from django.db import transaction
from .paystack import initialize_payment, verify_payment
from .emails import send_order_confirmation, send_payment_failed
from Notifications.utils import create_notification
from .utils import get_delivery_fee
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .squad import initialize_squad_payment, verify_squad_payment
from .tiktok import send_purchase_event, TikTokEventsAPIError


logger = logging.getLogger(__name__)

# Create your views here.

class ProductPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class ProductVariantViewSet(generics.ListCreateAPIView):
    queryset = ProductVariant.objects.all()
    serializer_class = ProductVariantSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        product_id = self.kwargs.get('product_id')
        return ProductVariant.objects.filter(product_id=product_id)

    def perform_create(self, serializer):
        product_id = self.kwargs.get('product_id')
        product = get_object_or_404(Product, id=product_id)

        if product.category != Product.CategoryChoices.RAW_MATERIAL:
            raise ValidationError("Variants can only be added to raw materials")
        
        serializer.save(product=product)

class ProductViewSet(generics.ListCreateAPIView):
    @method_decorator(cache_page(60 * 10))  
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    serializer_class = ProductSerializer
    pagination_class = ProductPagination

    def get_queryset(self):
        qs = Product.objects.prefetch_related('variants').all()
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category=category)
        return qs
    
    def get_permissions(self):
        self.permission_classes = [AllowAny]
        if self.request.method == "POST":
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
    

class ProductDetailApiView(generics.RetrieveAPIView):
    @method_decorator(cache_page(60 * 10))  
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    queryset = Product.objects.prefetch_related('variants').all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'

class OrderListApiView(generics.ListAPIView):
    serializer_class = OrderHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(
            user=self.request.user
        ).prefetch_related('items').order_by('-created_at')


class DeliveryFeeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        state = request.query_params.get('state')
        city = request.query_params.get('city', '')

        if not state:
            return Response(
                {"detail": "State is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        fee = get_delivery_fee(state,city)
        return Response({
            "state": state,
            "city": city or None,
            "delivery_fee": fee
        })



class CartCheckoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class= CartSyncCheckoutSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order, subtotal, total, delivery_fee, reference = serializer.save(user=request.user)

        response = initialize_squad_payment(
            email=request.user.email,
            amount=total,
            reference=reference,
            name=request.user.full_name or request.user.email
        )

        if response.get('status') != 200:
            order.delete()
            return Response(
                {
                    "detail": "Payment initialization failed. Please try again."
                },
                status=status.HTTP_502_BAD_GATEWAY
            )
        
        Payment.objects.create(
            order=order,
            reference=reference,
            amount=total,
        )

        return Response({
            'order_id': str(order.order_id),
            'reference': reference,
            "subtotal": subtotal,
            "delivery_fee": delivery_fee,
            'amount': total,
            'authorization_url': response['data']['checkout_url']
        }, status=status.HTTP_200_OK)
    

class SquadWebhookView(APIView):
    permission_classes = [AllowAny]

    VERIFICATION_VALID = 'valid'
    VERIFICATION_TRANSIENT = 'transient'
    VERIFICATION_INVALID = 'invalid'

    @staticmethod
    def _verification_state(verification, payment):
        if not isinstance(verification, dict):
            return SquadWebhookView.VERIFICATION_TRANSIENT
        if verification.get('status') != 200 or verification.get('success') is not True:
            return SquadWebhookView.VERIFICATION_TRANSIENT

        data = verification.get('data')
        if not isinstance(data, dict):
            return SquadWebhookView.VERIFICATION_TRANSIENT

        transaction_status = data.get('transaction_status')
        transaction_reference = data.get('transaction_ref')
        transaction_currency = data.get('transaction_currency_id')

        if not isinstance(transaction_status, str):
            return SquadWebhookView.VERIFICATION_TRANSIENT
        if transaction_status.casefold() == 'pending':
            return SquadWebhookView.VERIFICATION_TRANSIENT
        if transaction_status.casefold() != 'success':
            return SquadWebhookView.VERIFICATION_INVALID
        if transaction_reference != payment.reference:
            return SquadWebhookView.VERIFICATION_INVALID
        if transaction_currency != 'NGN':
            return SquadWebhookView.VERIFICATION_INVALID

        try:
            transaction_amount = Decimal(str(data.get('transaction_amount')))
        except (InvalidOperation, TypeError, ValueError):
            return SquadWebhookView.VERIFICATION_INVALID

        if transaction_amount != payment.amount * Decimal('100'):
            return SquadWebhookView.VERIFICATION_INVALID

        return SquadWebhookView.VERIFICATION_VALID

    def post(self, request):    
        squad_signature = request.headers.get('x-squad-encrypted-body')
        
        if not squad_signature:
            return Response(
                {
                    "detail": "Invalid signature."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        computed = hmac.new(
            settings.SQUAD_SECRET_KEY.encode('utf-8'),
            request.body,
            hashlib.sha512
        ).hexdigest().upper()

        if not hmac.compare_digest(squad_signature.upper(), computed):
            return Response(
                {
                    "detail": "Invalid signature."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        event = request.data
        body = event.get('Body', {})
        reference = body.get('transaction_ref')
        event_type = event.get('Event')

        if not reference or event_type != 'charge_successful':
            return Response(
                status=status.HTTP_200_OK
            )

        try:
            payment = Payment.objects.select_related('order').get(reference=reference)
        except Payment.DoesNotExist:
            return Response(status=status.HTTP_200_OK)

        verification = verify_squad_payment(reference)

        verification_state = self._verification_state(verification, payment)
        if verification_state != self.VERIFICATION_VALID:
            logger.error(
                'Squad verification was %s for payment reference=%s',
                verification_state,
                reference,
            )
            response_status = (
                status.HTTP_400_BAD_REQUEST
                if verification_state == self.VERIFICATION_INVALID
                else status.HTTP_503_SERVICE_UNAVAILABLE
            )
            return Response(
                {'detail': 'Payment verification is not conclusive.'},
                status=response_status,
            )

        with transaction.atomic():
            try:
                payment = (
                    Payment.objects
                    .select_for_update()
                    .select_related('order', 'order__user')
                    .get(reference=reference)
                )
            except Payment.DoesNotExist:
                return Response(status=status.HTTP_200_OK)

            newly_confirmed = (
                payment.status != Payment.StatusChoices.SUCCESS
                or payment.order.status != Order.StatusChoices.CONFIRMED
            )

            if payment.status != Payment.StatusChoices.SUCCESS:
                payment.status = Payment.StatusChoices.SUCCESS
                payment.save(update_fields=['status'])

            if payment.order.status != Order.StatusChoices.CONFIRMED:
                payment.order.status = Order.StatusChoices.CONFIRMED
                payment.order.save(update_fields=['status'])

        if newly_confirmed:
            try:
                create_notification(
                    user=payment.order.user,
                    type='payment',
                    title='Payment Confirmed',
                    message=f'Your payment of ₦{payment.amount:,.2f} was successful. Order {payment.order.order_id} is confirmed.'
                )
                send_order_confirmation(payment.order)
            except Exception:
                logger.exception(
                    'Post-payment notification failed for order=%s',
                    payment.order.order_id,
                )

        if newly_confirmed:
            try:
                send_purchase_event(payment)
            except TikTokEventsAPIError:
                # Analytics must never make Squad treat a confirmed payment as failed.
                # Durable retries require an outbox/delivery record, which is intentionally
                # deferred because this release must not introduce a migration.
                logger.exception(
                    'TikTok Purchase delivery failed for order=%s',
                    payment.order.order_id,
                )

        return Response(status=status.HTTP_200_OK)

# class SquadWebhookView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
        
#         squad_signature = request.headers.get('x-squad-encrypted-body')
#         if not squad_signature:
#             return Response(
#                 {"detail": "Invalid signature."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         event = request.data
#         reference = event.get('transaction_ref')

#         if not reference:
#             return Response(status=status.HTTP_200_OK)

#         try:
#             payment = Payment.objects.get(reference=reference)
#         except Payment.DoesNotExist:
#             return Response(status=status.HTTP_200_OK)

#         verification = verify_squad_payment(reference)

#         if verification.get('data', {}).get('transaction_status') == 'Success':
#             payment.status = Payment.StatusChoices.SUCCESS
#             payment.save()

#             payment.order.status = Order.StatusChoices.CONFIRMED
#             payment.order.save()

#             create_notification(
#                 user=payment.order.user,
#                 type='payment',
#                 title='Payment Confirmed',
#                 message=f'Your payment of ₦{payment.amount:,.2f} was successful. Order {payment.order.order_id} is confirmed.'
#             )

#             send_order_confirmation(payment.order)

#         else:
#             payment.status = Payment.StatusChoices.FAILED
#             payment.save()

#             payment.order.status = Order.StatusChoices.CANCELLED
#             payment.order.save()

#             create_notification(
#                 user=payment.order.user,
#                 type='payment',
#                 title='Payment Failed',
#                 message=f'Your payment for order {payment.order.order_id} was unsuccessful. Please try again.'
#             )

#             send_payment_failed(payment.order)

#         return Response(status=status.HTTP_200_OK)


# class PaystackWebhookView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         paystack_signature = request.headers.get('x-paystack-signature')
#         computed = hmac.new(
#             settings.PAYSTACK_SECRET_KEY.encode('utf-8'),
#             request.body,
#             hashlib.sha512
#         ).hexdigest()

#         if paystack_signature != computed:
#             return Response(
#                 {
#                     "detail":"Invalid signature.",
#                 },
#                 status=status.HTTP_400_BAD_REQUEST
#             )
        
#         event = request.data
#         if event.get('event') == 'charge.success':
#             reference = event['data']['reference']

#             try:
#                 payment = Payment.objects.get(reference=reference)
#             except Payment.DoesNotExist:
#                 return Response(
#                     status=status.HTTP_200_OK
#                 )
            
#             verification = verify_payment(reference)
#             if verification['data']['status'] == 'success':
#                 payment.status = Payment.StatusChoices.SUCCESS
#                 payment.save()

#                 payment.order.status = Order.StatusChoices.CONFIRMED
#                 payment.order.save()

#                 create_notification(
#                     user=payment.order.user,
#                     type='payment',
#                     title='Payment Confirmed',
#                     message=f'Your payment of ₦{payment.amount:,.2f} was successful. Order {payment.order.order_id} is confirmed.'
#                 )

#                 # for item in payment.order.items.select_related('product', 'variant').all():
#                 #     if item.variant:
#                 #         item.variant.stock -= item.quantity
#                 #         item.variant.save()
#                 #     else:
#                 #         item.product.stock -= item.quantity
#                 #         item.product.save()

#                 send_order_confirmation(payment.order)

#             elif event.get('event') == 'charge.failed':
#                 payment.status = Payment.StatusChoices.FAILED
#                 payment.save()

#                 payment.order.status = Order.StatusChoices.CANCELLED
#                 payment.order.save()

#                 create_notification(
#                     user=payment.order.user,
#                     type='payment',
#                     title='Payment Failed',
#                     message=f'Your payment for order {payment.order.order_id} was unsuccessful. Please try again.'
#                 )

#                 send_payment_failed(payment.order)
        
#         return Response(status=status.HTTP_200_OK)
    

class VerifyPaymentView(APIView):
    permission_classes = []

    def get(self, request, ref=None):
        try:
            payment = Payment.objects.get(reference=ref)
        except Payment.DoesNotExist:
            return Response(
                {"detail": "Payment not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response({
            'reference': payment.reference,
            'status': payment.status,
            'amount': payment.amount,
            'order_id': str(payment.order.order_id),
            'order_status': payment.order.status,
        })
    
class OrderTrackingView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_object(self):
        from django.shortcuts import get_object_or_404
        return get_object_or_404(
            Order,
            order_id=self.kwargs['order_id'],
            user=self.request.user
        )
