from django.urls import path
from . import views

urlpatterns = [
    path('variants/<int:product_id>/', views.ProductVariantViewSet.as_view()),
    path('categories/', views.ProductViewSet.as_view()),
    path('details/<int:pk>/', views.ProductDetailApiView.as_view()),
    path('orders/', views.OrderListApiView.as_view()),
    path('cart/', views.CartView.as_view(), name='cart'),
    path('cart/item/<int:item_id>/', views.CartItemUpdateView.as_view(), name='cart-item-update'),
]