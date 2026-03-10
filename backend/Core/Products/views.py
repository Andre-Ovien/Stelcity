from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly
from .models import ProductVariant, Product, Order, OrderItem
from .serializers import ProductVariantSerializer, ProductSerializer, OrderSerializer

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
        serializer.save(product_id=product_id)

class ProductViewSet(generics.ListCreateAPIView):
    queryset = Product.objects.prefetch_related('variants').all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        category = self.request.query_params.get('category')
        qs = Product.objects.prefetch_related('variants').all()
        if category:
            qs = qs.filter(category=category)
        return qs
    

class OrderListApiView(generics.ListAPIView):
    serializer_class = OrderSerializer
    queryset = Order.objects.select_related('items').all()