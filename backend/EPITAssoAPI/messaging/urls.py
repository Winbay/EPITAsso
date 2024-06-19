from django.urls import path
from .views import ConversationDetailView, ConversationListView, MessageListView

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
]
