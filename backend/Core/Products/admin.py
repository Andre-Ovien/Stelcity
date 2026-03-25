from django.contrib import admin
from .models import Product,ProductVariant,Order,OrderItem,DeliveryZone, DeliverySettings

# Register your models here.

admin.site.register(Product)
admin.site.register(ProductVariant)

class OrderItemInline(admin.TabularInline):
    model = OrderItem

class OrderAdmin(admin.ModelAdmin):
    inlines = [
        OrderItemInline
    ]

admin.site.register(Order, OrderAdmin)

@admin.register(DeliveryZone)
class DeliveryZoneAdmin(admin.ModelAdmin):
    list_display = ('state', 'area', 'fee', 'is_active')
    list_editable = ('fee', 'is_active')
    search_fields = ('state', 'area')
    ordering = ('state', 'area')

@admin.register(DeliverySettings)
class DeliverySettingsAdmin(admin.ModelAdmin):
    list_display = ('default_fee',)