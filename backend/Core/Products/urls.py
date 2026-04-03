from django.urls import path
from . import views

urlpatterns = [
    path('variants/<int:product_id>/', views.ProductVariantViewSet.as_view()),
    path('categories/', views.ProductViewSet.as_view()),
    path('details/<int:pk>/', views.ProductDetailApiView.as_view()),
    path('orders/', views.OrderListApiView.as_view()),
    path('cart/checkout/', views.CartCheckoutView.as_view(), name='cart-checkout'),
    path('payment/webhook/', views.SquadWebhookView.as_view(), name='webhook'),
    path('payment/verify/<str:ref>/', views.VerifyPaymentView.as_view(), name='verify-payment'),
    path('delivery-fee/', views.DeliveryFeeView.as_view(), name='delivery-fee'),
    path('orders/<uuid:order_id>/tracking/', views.OrderTrackingView.as_view(), name='order-tracking'),
]