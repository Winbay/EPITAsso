from django.urls import path
from .views import AssociationListView, AssociationDetailView

urlpatterns = [
    path("associations/", AssociationListView.as_view(), name="association-list"),
    path(
        "associations/<int:pk>/",
        AssociationDetailView.as_view(),
        name="association-detail",
    ),
]
