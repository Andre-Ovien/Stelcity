from django.contrib import admin
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('Auth.urls')),
    path('api/products/', include('Products.urls')),
    path('api/services/', include('Services.urls')),
    path('api/token/', TokenObtainPairView.as_view(),name="token"),
    path('api/token/refresh/', TokenRefreshView.as_view(),name="refresh"),
#    path("silk/", include("silk.urls", namespace="silk"))
]
