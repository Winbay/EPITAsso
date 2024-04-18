from django.urls import path, include
from .views import EventView

urlpatterns = [
    path('events/', EventView.as_view(), name='event-list'),
]