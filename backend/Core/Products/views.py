from django.shortcuts import render
from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from .models import ProductVariant, Product, Order, OrderItem
from .serializers import ProductVariantSerializer, ProductSerializer, OrderSerializer, CartItemAddSerializer, CartItemUpdateSerializer
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

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
    


class CartView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CartItemAddSerializer

    def get(self, request):
        try:
            order = Order.objects.get(
                user=request.user,
                status=Order.StatusChoices.PENDING
            )
            return Response(OrderSerializer(order).data)
        except Order.DoesNotExist:
            return Response({"detail": "Your cart is empty."})

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save(user=request.user)
        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)


class CartItemUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CartItemUpdateSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'item_id'

    def get_queryset(self):
        return OrderItem.objects.filter(
            order__user=self.request.user,
            order__status=Order.StatusChoices.PENDING
        )

    def get_object(self):
        return get_object_or_404(self.get_queryset(), id=self.kwargs['item_id'])

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(OrderSerializer(instance.order).data)