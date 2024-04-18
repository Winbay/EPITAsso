from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics
from .models import Message, Conversation
from .serializers import MessageSerializer, ConversationSerializer

class MessageView(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    @swagger_auto_schema(
        operation_summary="List all Messages",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @swagger_auto_schema(
        operation_summary="Create a Message",
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
    
class ConversationView(generics.ListCreateAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer

    @swagger_auto_schema(
        operation_summary="List all Conversations",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @swagger_auto_schema(
        operation_summary="Create a Conversation",
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)