from django.urls import path
from .views_without_association_id import (
    EventMemberCommitmentBulkUpdateView,
    EventMemberCommitmentListView,
    UpcomingEventsView,
    EventListPaginationView,
    EventLikeView,
    EventCommentCreateListView,
    EventCommentDeleteUpdateView,
)

urlpatterns = [
    path("events/upcoming/", UpcomingEventsView.as_view(), name="upcoming-events"),
    path("events/all/", EventListPaginationView.as_view(), name="event-all-list"),
    path(
        "events/<int:pk>/students-commitments/",
        EventMemberCommitmentListView.as_view(),
        name="event-commitment-list",
    ),
    path(
        "events/commitments/bulk-update/",
        EventMemberCommitmentBulkUpdateView.as_view(),
        name="bulk-update-commitments",
    ),
    path("events/<int:pk>/like/", EventLikeView.as_view(), name="event-like"),
    path(
        "events/<int:id>/comments/",
        EventCommentCreateListView.as_view(),
        name="event-comments-list-create",
    ),
    path(
        "events/<int:id>/comments/<int:commentId>/",
        EventCommentDeleteUpdateView.as_view(),
        name="event-comment-update-delete",
    ),
]
