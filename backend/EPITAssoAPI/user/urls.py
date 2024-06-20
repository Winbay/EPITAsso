from django.urls import path
from .views import (
    UserView,
    UserDetailView,
    UserLoggedDetailView,
    MicrosoftLoginView,
    MicrosoftTokenView,
    UserLoggedAssociationsView,
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("users/", UserView.as_view(), name="user-list"),
    path("users/me", UserLoggedDetailView.as_view(), name="user-me"),
    path("users/me/associations", UserLoggedAssociationsView.as_view(), name="user-me-associations"),
    path("users/<uuid:pk>", UserDetailView.as_view(), name="user-detail"),
    path("auth/authorize", MicrosoftLoginView.as_view(), name="microsoft-login"),
    path("auth/token", MicrosoftTokenView.as_view(), name="microsoft-token"),
    path("auth/refresh", TokenRefreshView.as_view(), name="token-refresh"),
]
