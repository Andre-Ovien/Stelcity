from django.shortcuts import render
from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from .models import ProductVariant, Product, Order, OrderItem, Payment, DeliveryZone, DeliverySettings
from .serializers import ProductVariantSerializer, ProductSerializer, OrderSerializer, CartSyncCheckoutSerializer, OrderHistorySerializer
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
import hmac, hashlib, uuid
from django.conf import settings
from .paystack import initialize_payment, verify_payment
from .emails import send_order_confirmation, send_payment_failed
from Notifications.utils import create_notification
from .utils import get_delivery_fee
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .squad import initialize_squad_payment, verify_squad_payment

# Create your views here.


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

        if squad_signature != computed:
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
            payment = Payment.objects.get(reference=reference)
        except Payment.DoesNotExist:
            return Response(status=status.HTTP_200_OK)

        if payment.status == Payment.StatusChoices.SUCCESS:
            return Response(status=status.HTTP_200_OK)

        verification = verify_squad_payment(reference)

        transaction_status = verification.get('data', {}).get('transaction_status')

        if transaction_status.lower() == 'success':
            payment.status = Payment.StatusChoices.SUCCESS
            payment.save()

            payment.order.status = Order.StatusChoices.CONFIRMED
            payment.order.save()

            create_notification(
                user=payment.order.user,
                type='payment',
                title='Payment Confirmed',
                message=f'Your payment of ₦{payment.amount:,.2f} was successful. Order {payment.order.order_id} is confirmed.'
            )
            send_order_confirmation(payment.order)

        else:
            payment.status = Payment.StatusChoices.FAILED
            payment.save()

            payment.order.status = Order.StatusChoices.CANCELLED
            payment.order.save()

            create_notification(
                user=payment.order.user,
                type='payment',
                title='Payment Failed',
                message=f'Your payment for order {payment.order.order_id} was unsuccessful. Please try again.'
            )
            send_payment_failed(payment.order)

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