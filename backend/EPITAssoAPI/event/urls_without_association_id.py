from django.urls import path
from .views import UpcomingEventsView, EventListPaginationView

urlpatterns = [
    path("events/upcoming/", UpcomingEventsView.as_view(), name="upcoming-events"),
    path("events/all/", EventListPaginationView.as_view(), name="event-all-list"),
]
