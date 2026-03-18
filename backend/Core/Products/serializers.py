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


# class CartItemAddSerializer(serializers.Serializer):
#     product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

#     def save(self, user):
#         product = self.validated_data['product_id']

#         order, _ = Order.objects.get_or_create(
#             user=user, status=Order.StatusChoices.PENDING
#         )

#         price = product.price if not product.has_variants() else None

#         OrderItem.objects.get_or_create(
#             order=order,
#             product=product,
#             defaults={'quantity': 1, 'price': price}
#         )

#         return order
    

class CartItemAddSerializer(serializers.Serializer):
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

    def validate_product_id(self, product):
        if product.has_variants() and not product.variants.exists():
            raise serializers.ValidationError(
                "This product has no variants available."
            )
        return product

    def save(self, user):
        product = self.validated_data['product_id']

        order, _ = Order.objects.get_or_create(
            user=user, status=Order.StatusChoices.PENDING
        )

        if product.has_variants():
            # grab cheapest variant as default
            default_variant = product.variants.order_by('price').first()
            price = default_variant.price
        else:
            default_variant = None
            price = product.price

        OrderItem.objects.get_or_create(
            order=order,
            product=product,
            defaults={
                'quantity': 1,
                'price': price,
                'variant': default_variant
            }
        )

        return order

# class CartItemUpdateSerializer(serializers.ModelSerializer):
#     variant_id = serializers.PrimaryKeyRelatedField(
#         queryset=ProductVariant.objects.all(),
#         source='variant',
#         required=False,
#         allow_null=True
#     )

#     class Meta:
#         model = OrderItem
#         fields = ('variant_id', 'quantity')

#     def validate(self, attrs):
#         item = self.instance
#         product = item.product
#         variant = attrs.get('variant', item.variant)
#         quantity = attrs.get('quantity', item.quantity)

#         if product.has_variants():
#             # raw material — block quantity changes, only variant selection allowed
#             if 'quantity' in self.initial_data:
#                 raise serializers.ValidationError(
#                     {"quantity": "Quantity cannot be changed for raw materials. Select a variant instead."}
#                 )
#             if not variant:
#                 raise serializers.ValidationError(
#                     {"variant_id": "Please select a variant for this product."}
#                 )
#             if variant.product != product:
#                 raise serializers.ValidationError(
#                     {"variant_id": "This variant does not belong to this product."}
#                 )
#             if variant.stock < 1:
#                 raise serializers.ValidationError(
#                     {"variant_id": "This variant is out of stock."}
#                 )
#         else:
#             # regular product — block variant changes, only quantity allowed
#             if 'variant_id' in self.initial_data:
#                 raise serializers.ValidationError(
#                     {"variant_id": "This product does not have variants."}
#                 )
#             if quantity > product.stock:
#                 raise serializers.ValidationError(
#                     {"quantity": f"Only {product.stock} units available."}
#                 )

#         return attrs

#     def update(self, instance, validated_data):
#         variant = validated_data.get('variant', instance.variant)

#         if variant:
#             instance.price = variant.price

#         instance.variant = variant
#         instance.quantity = validated_data.get('quantity', instance.quantity)
#         instance.save()
#         return instance

class CartItemUpdateSerializer(serializers.ModelSerializer):
    variant_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.all(),
        source='variant',
        required=False,
        allow_null=True
    )

    class Meta:
        model = OrderItem
        fields = ('variant_id', 'quantity')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance:
            if self.instance.product.has_variants():
                # raw material — drop quantity, only variant selection
                self.fields.pop('quantity', None)
            else:
                # regular product — drop variant, only quantity
                self.fields.pop('variant_id', None)

    def validate(self, attrs):
        item = self.instance
        variant = attrs.get('variant', item.variant)
        quantity = attrs.get('quantity', item.quantity)

        if item.product.has_variants():
            if not variant:
                raise serializers.ValidationError(
                    {"variant_id": "Please select a variant."}
                )
            if variant.product != item.product:
                raise serializers.ValidationError(
                    {"variant_id": "This variant does not belong to this product."}
                )
            if variant.stock < 1:
                raise serializers.ValidationError(
                    {"variant_id": "This variant is out of stock."}
                )
        else:
            if quantity > item.product.stock:
                raise serializers.ValidationError(
                    {"quantity": f"Only {item.product.stock} units available."}
                )

        return attrs

    def update(self, instance, validated_data):
        variant = validated_data.get('variant', instance.variant)

        if variant:
            instance.price = variant.price

        instance.variant = variant
        instance.quantity = validated_data.get('quantity', instance.quantity)
        instance.save()
        return instance