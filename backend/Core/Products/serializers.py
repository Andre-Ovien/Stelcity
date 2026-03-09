from rest_framework import serializers
from .models import Product, ProductVariant, Order, OrderItem


class ProductVariantSerializer(serializers.ModelSerializer):
#    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    class Meta:
        model = ProductVariant
        fields = (
            'id',
#            'product',
            'weight', 
            'price', 
            'stock',
        )

class ProductSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    class Meta:
        model = Product
        fields = (
            'category',
            'name',
            'description',
            'price',
            'stock',
            'image',
            'variants',
            'created_at',
            'updated_at',
        )

    def validate_stock(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError(
                "stock must be greater than 1!"
            )
        return value
    
    def validate(self, attrs):
        category = attrs.get('category')
        price = attrs.get('price')
        if category != Product.CategoryChoices.RAW_MATERIAL and not price:
            raise serializers.ValidationError({
                "price": "Price is required for products and services."
            })
        return attrs