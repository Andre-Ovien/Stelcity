from django.shortcuts import render
from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly
from .models import ProductVariant, Product, Order, OrderItem
from .serializers import ProductVariantSerializer, ProductSerializer, OrderSerializer
from django.shortcuts import get_object_or_404

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
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = Product.objects.prefetch_related('variants').all()
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category=category)
        return qs
    

class OrderListApiView(generics.ListAPIView):
    serializer_class = OrderSerializer
    queryset = Order.objects.select_related('items').all()