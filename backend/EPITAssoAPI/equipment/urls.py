from django.urls import path, include
from .views import EquipmentView

urlpatterns = [
    path('equipment/', EquipmentView.as_view(), name='equipment-list'),
]