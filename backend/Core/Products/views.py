from django.shortcuts import render
from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from .models import ProductVariant, Product, Order, OrderItem, Payment
from .serializers import ProductVariantSerializer, ProductSerializer, OrderSerializer, CartSyncCheckoutSerializer
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
import hmac, hashlib, uuid
from django.conf import settings
from .paystack import initialize_payment, verify_payment


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
    queryset = Product.objects.prefetch_related('variants').all()
    serializer_class = ProductSerializer

class OrderListApiView(generics.ListAPIView):
    serializer_class = OrderSerializer
    queryset = Order.objects.prefetch_related('items').all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(user=self.request.user)
    

class CartCheckoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class= CartSyncCheckoutSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order, total, reference = serializer.save(user=request.user)

        response = initialize_payment(
            email=request.user.email,
            amount=total,
            reference=reference
        )

        if not response.get('status'):
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
            'amount': total,
            'authorization_url': response['data']['authorization_url']
        }, status=status.HTTP_200_OK)
    
class PaystackWebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        paystack_signature = request.headers.get('x-paystack-signature')
        computed = hmac.new(
            settings.PAYSTACK_SECRET_KEY.encode('utf-8'),
            request.body,
            hashlib.sha512
        ).hexdigest()

        if paystack_signature != computed:
            return Response(
                {
                    "detail":"Invalid signature.",
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        event = request.data
        if event.get('event') == 'charge.success':
            reference = event['data']['reference']

            try:
                payment = Payment.objects.get(reference=reference)
            except Payment.DoesNotExist:
                return Response(
                    status=status.HTTP_200_OK
                )
            
            verification = verify_payment(reference)
            if verification['data']['status'] == 'success':
                payment.status = Payment.StatusChoices.SUCCESS
                payment.save()

                payment.order.status = Order.StatusChoices.CONFIRMED
                payment.order.save()
        
        return Response(status=status.HTTP_200_OK)
    

class VerifyPaymentView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self, request, reference):
        try:
            payment = Payment.objects.get(
                reference=reference,
                order__user=request.user
            )
        except Payment.DoesNotExist:
            return Response(
                {
                    "detail": "Payment not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response(
            {
                'reference': payment.reference,
                'status': payment.status,
                'amount': payment.amount,
                'order_id': str(payment.order.order_id),
                'order_status': payment.order.status,
            }
        )