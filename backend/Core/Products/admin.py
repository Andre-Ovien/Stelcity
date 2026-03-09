from django.contrib import admin
from .models import Product,ProductVariant,Order,OrderItem

# Register your models here.

admin.site.register(Product)
admin.site.register(ProductVariant)
admin.site.register(Order)
admin.site.register(OrderItem)