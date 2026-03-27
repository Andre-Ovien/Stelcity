from django.shortcuts import render
from .models import ServiceCategory, Service
from rest_framework import generics
from rest_framework.permissions import IsAdminUser, AllowAny
from .serializers import ServiceCategorySerializer, ServiceSerializer, ServiceCategoryWithServicesSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

# Create your views here.

class ServiceCategoryListCreateApiView(generics.ListCreateAPIView):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer

    def get_permissions(self):
        self.permission_classes = [AllowAny]
        if self.request.method == "POST":
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()


class ServiceListCreateApiView(generics.ListCreateAPIView):
    @method_decorator(cache_page(60 * 10))  
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    queryset = Service.objects.select_related('category').all()
    serializer_class = ServiceSerializer

    def get_permissions(self):
        self.permission_classes = [AllowAny]
        if self.request.method == "POST":
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()

    def get_queryset(self):
        qs = Service.objects.select_related('category').all()
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category__name__icontains=category)
        return qs

class ServiceView(generics.ListAPIView):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategoryWithServicesSerializer