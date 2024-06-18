from drf_spectacular.utils import extend_schema
from rest_framework import generics, serializers, status
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination
from association.models import Association
from .models import Message, Conversation
from .serializers import MessageSerializer, ConversationSerializer


class MessageListView(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        conversation_id = self.kwargs.get('pk')
        return Message.objects.filter(conversation_id=conversation_id)

    @extend_schema(summary="List all Messages")
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @extend_schema(summary="Create a Message")
    def post(self, request, *args, **kwargs):
        request.data['conversation'] = kwargs.get('pk')
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=self.request.user,
                             association_sender=self.__get_association_sender()
                             )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def __get_association_sender(self):
        association_id = self.kwargs.get('association_id')
        try:
            association = Association.objects.get(id=association_id)
        except Association.DoesNotExist:
            raise serializers.ValidationError('Invalid association ID')
        return association

class ConversationListView(generics.ListCreateAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer

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
