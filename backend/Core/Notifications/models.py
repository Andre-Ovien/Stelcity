from django.db import models
from django.conf import settings


class Notification(models.Model):
    class TypeChoices(models.TextChoices):
        ORDER = 'order', 'Order'
        PAYMENT = 'payment', 'Payment'
        PROMOTION = 'promotion', 'Promotion'
        ACCOUNT = 'account', 'Account'
        WISHLIST = 'wishlist', 'Wishlist'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    type = models.CharField(max_length=20, choices=TypeChoices.choices)
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.type} notification for {self.user.email}"