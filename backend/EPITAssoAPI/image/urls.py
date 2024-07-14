from django.urls import path
from .views import (
    ImageUploadView,
    ImageDetailUpdateView,
    ImageDeleteView,
    ImageListView,
)
from django.urls import include

urlpatterns = [
    path(
        "images/",
        include(
            [
                path("", ImageListView.as_view(), name="image-upload"),
                path("upload/", ImageUploadView.as_view(), name="image-upload"),
                path(
                    "<int:pk>/",
                    ImageDetailUpdateView.as_view(),
                    name="image-detail-update",
                ),
                path("<int:pk>/", ImageDeleteView.as_view(), name="image-delete"),
            ]
        ),
    )
]
