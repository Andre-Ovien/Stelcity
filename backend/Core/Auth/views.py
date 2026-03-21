from django.shortcuts import render
from .serializers import RegisterSerializer, LoginSerializer, ProfileSerializer, ShippingAddressSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.views import APIView
from .throttles import LoginRateThrottle, RegisterRateThrottle
from rest_framework.permissions import IsAuthenticated
from .models import ShippingAddress

# Create your views here.

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


class RegisterView(APIView):
    throttle_classes = [RegisterRateThrottle]
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        tokens = get_tokens_for_user(user)

        return Response(
            {
                "user": serializer.data,
                "tokens": tokens,
                "message": "Account successfully created",
            },
            status=status.HTTP_201_CREATED
        )
    
class LoginView(APIView):
    throttle_classes = [LoginRateThrottle]
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        tokens = get_tokens_for_user(user)

        return Response(
            {
                "user": serializer.data,
                "tokens": tokens,
                "message": "Logged in successfully"
            },
            status=status.HTTP_200_OK
        )
    
class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer

    def get_object(self):
        return self.request.user
    
class ShippingAddressView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ShippingAddressSerializer

    def get_object(self):
        address, _ = ShippingAddress.objects.get_or_create(
            user=self.request.user,
            defaults={
                'full_name': self.request.user.full_name or '',
                'phone_number': self.request.user.phone_number or '',
                'street_address': '',
                'city': '',
                'state': '',
                'country': '',
            }
        )
        return address