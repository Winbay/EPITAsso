from drf_spectacular.utils import extend_schema
from rest_framework import generics
from .models import Message, Conversation
from .serializers import MessageSerializer, ConversationSerializer


class MessageView(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    @extend_schema(
        summary="List all Messages",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        summary="Create a Message",
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class ConversationView(generics.ListCreateAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer

    @extend_schema(
        summary="List all Conversations",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        summary="Create a Conversation",
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
