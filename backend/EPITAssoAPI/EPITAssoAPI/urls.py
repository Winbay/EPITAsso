"""
URL configuration for EPITAssoAPI project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.conf import settings
from django.urls import path, include
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

urlpatterns = [
    # Admin Django
    path("admin/", admin.site.urls),
    # API endpoints
    path(
        "api/",
        include(
            [
                path("swagger-file", SpectacularAPIView.as_view(), name="schema"),
                path(
                    "swagger-ui",
                    SpectacularSwaggerView.as_view(url_name="schema"),
                    name="swagger-ui",
                ),
                path(
                    "redoc",
                    SpectacularRedocView.as_view(url_name="schema"),
                    name="redoc",
                ),
                path(
                    "<int:association_id>/",
                    include(
                        [
                            path("", include("event.urls")),
                            path("", include("post.urls")),
                            path("", include("equipment.urls")),
                            path("", include("messaging.urls")),
                            path("", include("image.urls")),
                        ]
                    ),
                ),
                path("", include("user.urls")),
                path("", include("association.urls")),
                path("", include("event.urls_without_association_id")),
            ]
        ),
    ),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
