from rest_framework import serializers
from .models import Product, ProductVariant, Order, OrderItem, DeliverySettings, DeliveryZone
import uuid
from .utils import get_delivery_fee

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
    total_stock = serializers.SerializerMethodField()
    in_stock = serializers.SerializerMethodField()

    def get_total_stock(self, obj):
        return obj.total_stock

    def get_in_stock(self, obj):
        return obj.in_stock

    class Meta:
        model = Product
        fields = (
            'id',
            'category',
            'name',
            'description',
            'price',
            'stock',
            'total_stock',
            'in_stock',
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
            'id',
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

class OrderHistorySerializer(serializers.ModelSerializer):
    total_price = serializers.SerializerMethodField()

    def get_total_price(self, obj):
        return sum(item.item_subtotal for item in obj.items.all())

    class Meta:
        model = Order
        fields = (
            'order_id',
            'status',
            'total_price',
            'created_at',
        )    


class DeliveryFeeSerializer(serializers.Serializer):
    state = serializers.CharField(required=True)
    area = serializers.CharField(required=False, allow_blank=True)


class CartSyncCheckoutSerializer(serializers.Serializer):
    items = serializers.ListField(child=serializers.DictField(), min_length=1)
    state = serializers.CharField(required=True)
    area = serializers.CharField(required=False, allow_blank=True, default='')

    def validate_items(self, items):
        validated_items = []

        for item in items:
            product_id = item.get('product_id')
            variant_id = item.get('variant_id')
            quantity = item.get('quantity',1)

            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                raise serializers.ValidationError(
                    f"Product with id {product_id} does not exist."
                )
            
            if not isinstance(quantity, int) or quantity < 1:
                raise serializers.ValidationError(
                    f"Invalid quantity for {product.name}"
                )
            
            variant = None
            if product.has_variants():
                if not variant_id:
                    raise serializers.ValidationError(
                        f"{product.name} requires a variant to be selected."
                    )
                try:
                    variant = ProductVariant.objects.get(id=variant_id, product=product)
                except ProductVariant.DoesNotExist:
                    raise serializers.ValidationError(
                        f"Invalid variant for {product.name}."
                    )
                if variant.stock < quantity:
                    raise serializers.ValidationError(
                        f"Only {variant.stock} units available for {product.name} ({variant.weight})."
                    )
            else:
                if quantity > product.stock:
                    raise serializers.ValidationError(
                        f"Only {product.stock} units available for {product.name}."
                    )
                
            price = variant.price if variant else product.price

            validated_items.append({
                'product': product,
                'variant': variant,
                'quantity': quantity,
                'price': price,
            })
        
        return validated_items
    

    def save(self, user):
        validated_items = self.validated_data['items']
        state = self.validated_data['state']
        area = self.validated_data.get('area', '')

        delivery_fee = get_delivery_fee(state, area)

        Order.objects.filter(
            user=user,
            status__in=[
            Order.StatusChoices.PENDING,
            Order.StatusChoices.CANCELLED
        ]
        ).delete()

        order = Order.objects.create(
            user=user,
            status=Order.StatusChoices.PENDING,
            delivery_fee=delivery_fee
        )

        OrderItem.objects.bulk_create([
            OrderItem(
                order=order,
                product=item['product'],
                variant=item['variant'],
                quantity=item['quantity'],
                price=item['price'],
            )
            for item in validated_items
        ])

        subtotal = sum(item['price'] * item['quantity'] for item in validated_items)
        total = subtotal + delivery_fee
        reference = str(uuid.uuid4()).replace('-','')[:12].upper()

        return order, subtotal, total, delivery_fee, reference