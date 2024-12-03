from django.urls import path
from .views import (
    ConversationDetailView,
    ConversationListView,
    MessageListView,
    MessageDetailView,
)

urlpatterns = [
    path("conversations/", ConversationListView.as_view(), name="conversation-list"),
    path(
        "conversations/<int:pk>/",
        ConversationDetailView.as_view(),
        name="conversation-detail",
    ),
    path(
        "conversations/<int:pk>/messages/",
        MessageListView.as_view(),
        name="message-list",
    ),
    path(
        "conversations/<int:conversation_id>/messages/<int:message_id>/",
        MessageDetailView.as_view(),
        name="message-detail",
    ),
]
