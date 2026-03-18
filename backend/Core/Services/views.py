from django.shortcuts import render
from .models import ServiceCategory, Service
from rest_framework import generics
from rest_framework.permissions import IsAdminUser, AllowAny
from .serializers import ServiceCategorySerializer, ServiceSerializer, ServiceCategoryWithServicesSerializer

# Create your views here.

class ServiceCategoryListCreateApiView(generics.ListCreateAPIView):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer
    permission_classes = [IsAdminUser]

    def get_permissions(self):
        self.permission_classes = [AllowAny]
        if self.request.method == "POST":
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()


class ServiceListCreateApiView(generics.ListCreateAPIView):
    queryset = Service.objects.select_related('category').all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        qs = Service.objects.select_related('category').all()
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category__name__icontains=category)
        return qs

class ServiceView(generics.ListAPIView):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategoryWithServicesSerializer