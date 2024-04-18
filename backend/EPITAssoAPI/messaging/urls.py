from django.urls import path, include
from .views import MessageView, ConversationView

urlpatterns = [
    path('messages/', MessageView.as_view(), name='message-list'),
    path('conversations/', ConversationView.as_view(), name='conversation-list'),
]
