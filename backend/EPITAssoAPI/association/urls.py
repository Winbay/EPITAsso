from django.urls import path
from .views import AssociationView

urlpatterns = [
    path("associations/", AssociationView.as_view(), name="association-list"),
]
