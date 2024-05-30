from django.urls import path
from .views import EventListView, EventDetailView, TagListView, TagDetailView

urlpatterns = [
    path("events/", EventListView.as_view(), name="event-list"),
    path("events/<int:pk>/", EventDetailView.as_view(), name="event-detail"),
    path("events/tags/", TagListView.as_view(), name="tag-list"),
    path("events/tags/<int:pk>/", TagDetailView.as_view(), name="tag-detail"),
]
