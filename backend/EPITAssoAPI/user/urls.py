from django.urls import path
from .views import (
    UserView,
    MicrosoftLoginView,
    MicrosoftCallbackView,
    MicrosoftAuthCompleteView,
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("users/", UserView.as_view(), name="user-list"),
    path("auth/login", MicrosoftLoginView.as_view(), name="microsoft-login"),
    path(
        "auth/complete",
        MicrosoftAuthCompleteView.as_view(),
        name="microsoft-auth-complete",
    ),
    path("auth/callback", MicrosoftCallbackView.as_view(), name="microsoft-callback"),
    path("token/refresh", TokenRefreshView.as_view(), name="token_refresh"),
]
