from django.shortcuts import render
from .models import ServiceCategory, Service
from rest_framework import generics
from rest_framework.permissions import IsAdminUser
from .serializers import ServiceCategorySerializer, ServiceSerializer, ServiceCategoryWithServicesSerializer

# Create your views here.

class ServiceCategoryListCreateApiView(generics.ListCreateAPIView):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer
    permission_classes = [IsAdminUser]


class ServiceListCreateApiView(generics.ListCreateAPIView):
    queryset = Service.objects.select_related('category').all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminUser]

class ServiceView(generics.ListAPIView):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategoryWithServicesSerializer