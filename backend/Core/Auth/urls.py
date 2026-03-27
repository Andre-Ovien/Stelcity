from django.urls import path
from . import views

urlpatterns = [
    path('login/',views.LoginView.as_view()),
    path('register/',views.RegisterView.as_view()),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('shipping-address/', views.ShippingAddressView.as_view(), name='shipping-address'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    path('newsletter/subscribe/', views.NewsletterSubscribeView.as_view(), name='newsletter-subscribe'),
]