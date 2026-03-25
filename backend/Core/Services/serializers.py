from rest_framework import serializers
from .models import ServiceCategory, Service


class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = (
            'name',
            'description',
            'image',
        )


class ServiceSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=ServiceCategory.objects.all(),write_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    class Meta:
        model = Service
        fields = (
            'category',
            'category_name',
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
            'image',
            'services'    
        )