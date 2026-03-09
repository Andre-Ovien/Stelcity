from django.urls import path
from . import views

urlpatterns = [
    path('service-category/', views.ServiceCategoryListCreateApiView.as_view()),
    path('add-service/', views.ServiceListCreateApiView.as_view()),
]