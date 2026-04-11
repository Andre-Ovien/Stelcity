from django.contrib import admin
from .models import Product,ProductVariant,Order,OrderItem,DeliveryZone, DeliverySettings, OrderTracking, Payment
from Notifications.utils import create_notification
from Auth.models import ShippingAddress 
# Register your models here.

admin.site.register(Product)
admin.site.register(ProductVariant)

class OrderTrackingInline(admin.TabularInline):
    model = OrderTracking
    extra = 1
    readonly_fields = ('updated_at',)

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    readonly_fields = ('product', 'variant', 'quantity', 'price')
    extra = 0

class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'user', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('user__email',)
    readonly_fields = ('order_id', 'created_at', 'get_shipping_address')
    inlines = [OrderItemInline, OrderTrackingInline]

    def get_shipping_address(self, obj):
        if obj.fulfillment_type == 'pickup':
            return 'Customer will pick up — no delivery needed'
        
        try:
            address = obj.user.shipping_address
            return (
                f"Name: {address.full_name} | "
                f"Phone: {address.phone_number} | "
                f"Address: {address.street_address}, "
                f"{address.city}, {address.state}, "
                f"{address.country} "
                f"{address.postal_code or ''}"
            )
        except ShippingAddress.DoesNotExist:
            return 'No shipping address saved for this user'

    get_shipping_address.short_description = 'Shipping Address'

    fieldsets = (
        ('Order Info', {
            'fields': ('order_id', 'user', 'status', 'fulfillment_type', 'delivery_fee', 'created_at')
        }),
        ('Delivery Details', {
            'fields': ('get_shipping_address',)
        }),
    )

    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)
        for instance in instances:
            if isinstance(instance, OrderTracking):
                instance.save()
                
                create_notification(
                    user=instance.order.user,
                    type='order',
                    title='Order Update',
                    message=f'Your order {instance.order.order_id} is now {instance.get_status_display()}. {instance.note or ""}'
                )
        formset.save_m2m()
admin.site.register(Order, OrderAdmin)

@admin.register(DeliveryZone)
class DeliveryZoneAdmin(admin.ModelAdmin):
    list_display = ('state', 'city', 'fee', 'is_active')
    list_editable = ('fee', 'is_active')
    search_fields = ('state', 'city')
    ordering = ('state', 'city')

@admin.register(DeliverySettings)
class DeliverySettingsAdmin(admin.ModelAdmin):
    list_display = ('default_fee',)



@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('reference', 'order', 'amount', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('reference', 'order__order_id')
    readonly_fields = ('reference', 'amount', 'created_at')