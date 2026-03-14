from django.contrib import admin
from .models import Product,ProductVariant,Order,OrderItem

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