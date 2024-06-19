from rest_framework import serializers

from association.serializers import AssociationSimpleSerializer
from user.serializers import UserSimpleSerializer
from .models import Message, Conversation


class MessageSerializer(serializers.ModelSerializer):
    author = UserSimpleSerializer(read_only=True)
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
        ]
        read_only_fields = ["sent_at", "author", "association_sender"]


class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ["id", "name", "associations", "last_sent_at"]
        read_only_fields = ["last_sent_at"]
