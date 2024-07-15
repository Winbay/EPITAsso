from rest_framework import serializers

from association.serializers import AssociationSimpleSerializer
from user.serializers import UserWithLoginSerializer
from .models import Message, Conversation


class MessageSerializer(serializers.ModelSerializer):
    author = UserWithLoginSerializer(read_only=True)
    association_sender = AssociationSimpleSerializer(read_only=True)

    class Meta:
        model = Message
        fields = [
            "id",
            "content",
            "sent_at",
            "author",
            "association_sender",
            "conversation",
            "updated_at",
        ]
        read_only_fields = ["sent_at", "author", "association_sender", "updated_at"]

class MessageUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["content"]


class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ["id", "name", "associations", "last_sent_at"]
        read_only_fields = ["last_sent_at"]
