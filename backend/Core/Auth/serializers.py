from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(required=True, write_only=True, validators=[validate_password])
    class Meta:
        model = User
        fields = (
            'name',
            'email',
            'password',
        )

    def validate_email(self, value):
        if User.objects.filter(email=value).exists(): 
            raise serializers.ValidationError(
                "Email address already exists."
            )
        return value
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(username=email, password=password)
    
        if not user:
            raise serializers.ValidationError(
                "Invalid login credentials"
            )
        
        if not user.is_active:
            raise serializers.ValidationError(
                "Account disabled"
            )
    
        attrs['user'] = user
        return attrs