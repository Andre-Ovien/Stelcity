from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from .models import User, ShippingAddress, NewsletterSubscriber, Newsletter
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(required=True, write_only=True, validators=[validate_password])
    class Meta:
        model = User
        fields = (
#            'name',
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
    

class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(read_only=True)

    class Meta:
        model = User
        fields = (
            'email',
            'full_name',
            'phone_number',
            'gender',
            'date_of_birth',
        )

    def validate_phone_number(self, value):
        if value and not value.replace('+', '').isdigit():
            raise serializers.ValidationError(
                "Enter a valid phone number."
            )
        return value

    def validate_date_of_birth(self, value):
        from datetime import date
        if value and value >= date.today():
            raise serializers.ValidationError(
                "Date of birth must be in the past."
            )
        return value
    

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = (
            'id',
            'full_name',
            'phone_number',
            'street_address',
            'city',
            'state',
            'country',
            'postal_code',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('created_at', 'updated_at')

    def validate_phone_number(self, value):
        if value and not value.replace('+', '').isdigit():
            raise serializers.ValidationError(
                "Enter a valid phone number."
            )
        return value

    def update(self, instance, validated_data):
        user = instance.user
        user.full_name = validated_data.get('full_name', user.full_name)
        user.phone_number = validated_data.get('phone_number', user.phone_number)
        user.save()

        return super().update(instance, validated_data)
    

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)
    confirm_password = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match."}
            )
        return attrs

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError(
                "Current password is incorrect."
            )
        return value

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
    

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ('email',)

    def validate_email(self, value):
        if NewsletterSubscriber.objects.filter(email=value, is_active=True).exists():
            raise serializers.ValidationError(
                "This email is already subscribed."
            )
        return value