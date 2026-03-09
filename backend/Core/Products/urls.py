from django.urls import path
from . import views

urlpatterns = [
    path('variants/<int:product_id>/', views.ProductVariantViewSet.as_view()),
    path('categories/', views.ProductViewSet.as_view()),
]