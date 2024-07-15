from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from rest_framework import generics, serializers, status
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.exceptions import PermissionDenied
from association.models import Association
from .models import Message, Conversation
from .serializers import MessageSerializer, ConversationSerializer, MessageUpdateSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json
from django.shortcuts import get_object_or_404


class MessageListView(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        conversation_id = self.kwargs.get("pk")
        return Message.objects.filter(conversation_id=conversation_id)

    @extend_schema(
        summary="List all Messages",
        parameters=[
            OpenApiParameter(
                name="limit",
                description="Number of results to return",
                required=False,
                type=int,
                location=OpenApiParameter.QUERY,
            ),
            OpenApiParameter(
                name="offset",
                description="Initial offset in the results",
                required=False,
                type=int,
                location=OpenApiParameter.QUERY,
            ),
        ],
        responses=MessageSerializer(many=True),
    )
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @extend_schema(
        summary="Create a Message",
        request=MessageUpdateSerializer,
        responses={
            status.HTTP_201_CREATED: OpenApiResponse(
                response=MessageSerializer,
                description="Message successfully created"
            ),
            status.HTTP_400_BAD_REQUEST: OpenApiResponse(
                description="Invalid input"
            )
        },
    )
    def post(self, request, *args, **kwargs):
        request_mutable_data = request.data.copy()
        conversation_id = kwargs.get("pk")
        request_mutable_data["conversation"] = conversation_id
        serializer = self.get_serializer(data=request_mutable_data)
        if serializer.is_valid():
            serializer.save(
                author=self.request.user,
                association_sender=self.__get_association_sender(),
            )

            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f"conversation_{conversation_id}",
                {
                    "type": "chat.message.sent",
                    "message": json.dumps(serializer.data)
                },
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def __get_association_sender(self):
        association_id = self.kwargs.get("association_id")
        try:
            association = Association.objects.get(id=association_id)
        except Association.DoesNotExist:
            raise serializers.ValidationError("Invalid association ID")
        return association


class MessageDetailView(generics.GenericAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageUpdateSerializer

    def get_object(self):
        conversation_id = self.kwargs.get("conversation_id")
        message_id = self.kwargs.get("message_id")
        message = get_object_or_404(Message, pk=message_id, conversation_id=conversation_id)
        return message

    @extend_schema(
        summary="Update a Message",
        parameters=[
            OpenApiParameter(
                name='conversation_id',
                description='The ID of the conversation to which the message belongs',
                required=True,
                type=int,
                location=OpenApiParameter.PATH
            ),
            OpenApiParameter(
                name='message_id',
                description='The ID of the message to be updated',
                required=True,
                type=int,
                location=OpenApiParameter.PATH
            ),
        ],
        request=MessageUpdateSerializer,
        responses={
            200: MessageSerializer,
            403: OpenApiResponse(description="Forbidden - You do not have permission to edit this message."),
            404: OpenApiResponse(description="Not Found - The specified message does not exist."),
            400: OpenApiResponse(description="Bad Request - Invalid data provided."),
        }
    )
    def patch(self, request, *args, **kwargs):
        message = self.get_object()

        if message.author != request.user:
            return Response({"detail": "You do not have permission to edit this message."}, status=status.HTTP_403_FORBIDDEN)

        partial = True
        serializer = self.get_serializer(message, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f"conversation_{message.conversation.id}",
                {
                    "type": "chat.message.updated",
                    "message": json.dumps({
                        "id": message.id,
                        "content": serializer.data["content"]
                    })
                }
            )
            
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(summary="Delete a Message")
    def delete(self, request, *args, **kwargs):
        message = self.get_object()
        if message.author != request.user:
            raise PermissionDenied("You do not have permission to delete this message.")
        
        message_id = message.id
        message.delete()

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"conversation_{kwargs['conversation_id']}",
            {
                "type": "chat.message.deleted",
                "message": json.dumps({"id": message_id}),
            },
        )

        return Response(status=status.HTTP_204_NO_CONTENT)

class ConversationListView(generics.ListCreateAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer

    def get_queryset(self):
        association_id = self.kwargs["association_id"]
        return Conversation.objects.filter(associations__id=association_id)

    @extend_schema(summary="List all Conversations")
    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(summary="Create a Conversation")
    def post(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


class ConversationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer

    @extend_schema(summary="Retrieve a Conversation")
    def get(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(summary="Update a Conversation")
    def put(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @extend_schema(summary="Delete a Conversation")
    def delete(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
