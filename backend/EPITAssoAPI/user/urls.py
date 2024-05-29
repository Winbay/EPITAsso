from django.urls import path
from .views import UserView, microsoft_login, microsoft_auth_complete, microsoft_callback
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("users/", UserView.as_view(), name="user-list"),
    path("auth/login", microsoft_login, name="microsoft-login"),
    path("auth/complete", microsoft_auth_complete, name="microsoft-auth-complete"),
    path("auth/callback", microsoft_callback, name="microsoft-callback"),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]
