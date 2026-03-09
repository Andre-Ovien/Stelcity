from rest_framework import serializers
from .models import ServiceCategory, Service


class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = (
            'name',
            'description',
        )


class ServiceSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="category.name")
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    class Meta:
        model = Service
        fields = (
            'category',
            'name',
            'description',
            'price',
            'created_at',
            'updated_at',
        )


class ServiceCategoryWithServicesSerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)
    class Meta:
        model = ServiceCategory
        fields = (
            'id',
            'name',
            'description',
            'services'    
        )