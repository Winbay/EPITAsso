from django.urls import path, include
from .views import AssociationView

urlpatterns = [
    path('associations/', AssociationView.as_view(), name='association-list'),
]