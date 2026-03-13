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
            'id',
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
                "price": "Price is required for products."
            })
        return attrs

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name")
    product_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        source="product.price"
    )
    class Meta:
        model = OrderItem
        fields = (
            'product_name',
            'product_price',
            'quantity',
            'variant',
            'price',
            'item_subtotal',
        )

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True,read_only=True)
    total_price = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(read_only=True)

    def get_total_price(self, obj):
        order_items = obj.items.all()
        return sum(order_item.item_subtotal for order_item in order_items)

    class Meta:
        model = Order
        fields = (
            'order_id',
            'items',
            'total_price',
            'created_at',
            'user',
            'status',
        )