from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
from django.conf import settings
from cloudinary_storage.storage import MediaCloudinaryStorage
from django.db.models import Q
# Create your models here.


class Product(models.Model):
    class CategoryChoices(models.TextChoices):
        PRODUCT = "product"
        RAW_MATERIAL = "raw_material"

    category = models.CharField(max_length=20,choices=CategoryChoices.choices)
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
#    stock = models.PositiveIntegerField(null=True,blank=True)
    image = models.ImageField(storage=MediaCloudinaryStorage(),upload_to="Stelcity/Products", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # @property
    # def in_stock(self):
    #     if self.has_variants():
    #         return self.total_stock > 0
    #     return self.stock > 0

    # @property
    # def total_stock(self):
    #     if self.has_variants():
    #         return sum(v.stock for v in self.variants.all())
    #     return self.stock

    def has_variants(self):
        return self.category == self.CategoryChoices.RAW_MATERIAL

    def __str__(self):
        return self.name

class ProductVariant(models.Model):
    product = models.ForeignKey(Product,related_name="variants",on_delete=models.CASCADE)
    weight = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10,decimal_places=2)
#    stock = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.product.name} - {self.weight}"
    
class Order(models.Model):
    class StatusChoices(models.TextChoices):
        PENDING = 'Pending'
        CONFIRMED = 'Confirmed'
        CANCELLED = 'Cancelled'

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'status'],
                condition=Q(status='Pending'),
                name='one_pending_order_per_user'
            )
        ]

    order_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    delivery_fee = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=10,
        choices=StatusChoices.choices,
        default=StatusChoices.PENDING
    )

    def __str__(self):
        return f"Order {self.order_id} by {self.user.email}"
    

class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    variant = models.ForeignKey(ProductVariant, null=True, blank=True, on_delete=models.SET_NULL)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    @property
    def item_subtotal(self):
        return self.price * self.quantity
    
    def __str__(self):
        if self.variant:
            return f"{self.quantity} x {self.variant} in Order {self.order.order_id}"
        return f"{self.quantity} x {self.product.name} in Order {self.order.order_id}"
    

class Payment(models.Model):
    class StatusChoices(models.TextChoices):
        PENDING = 'pending'
        SUCCESS = 'success'
        FAILED = 'failed'

    order = models.OneToOneField(
        Order,
        on_delete=models.CASCADE,
        related_name='payment'
    )
    reference = models.CharField(max_length=200, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=10,
        choices=StatusChoices.choices,
        default=StatusChoices.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.reference} for Order {self.order.order_id}"


class DeliveryZone(models.Model):
    """Specific areas within a state e.g Ikorodu, Ikeja"""
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=100, blank=True, null=True)
    fee = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('state', 'city')
        ordering = ('state', 'city')

    def __str__(self):
        if self.city:
            return f"{self.city}, {self.state} — ₦{self.fee}"
        return f"{self.state} (default) — ₦{self.fee}"


class DeliverySettings(models.Model):
    """Global fallback fee for unlisted states"""
    default_fee = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = 'Delivery Settings'
        verbose_name_plural = 'Delivery Settings'

    def __str__(self):
        return f"Default delivery fee: ₦{self.default_fee}"