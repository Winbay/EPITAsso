from rest_framework import serializers

from association.serializers import MemberSerializer
from .models import Event, EventMemberCommitment, Like, Comment
from post.models import Tag
from post.serializers import TagSerializer
from association.serializers import AssociationSimpleWithLogoSerializer


class EventSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)
    association = AssociationSimpleWithLogoSerializer(read_only=True)
    author = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    is_liked_by_user = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            "id",
            "author",
            "association",
            "name",
            "content",
            "start_date",
            "end_date",
            "recurrent",
            "frequency",
            "end_recurrence",
            "tags",
            "like_count",
            "is_liked_by_user",
        ]

    def get_author(self, obj):
        return obj.author.login

    def get_like_count(self, obj):
        return Like.objects.filter(event=obj).count()

    def get_is_liked_by_user(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return Like.objects.filter(event=obj, user=request.user).exists()
        return False

    def create(self, validated_data):
        tags_data = validated_data.pop("tags", [])
        event = Event.objects.create(**validated_data)
        event.tags.set(self._get_tag_instances(tags_data))
        return event

    def update(self, instance, validated_data):
        tags_data = validated_data.pop("tags", [])

        for attr, value in validated_data.items():
            if attr in self.get_fields():
                setattr(instance, attr, value)
        instance.save()

        if tags_data:
            instance.tags.set(self._get_tag_instances(tags_data))
        else:
            instance.tags.clear()

        return instance

    def _get_tag_instances(self, tags_data):
        tag_names = [tag["name"] for tag in tags_data if "name" in tag]
        return Tag.objects.filter(name__in=tag_names)


class EventMemberCommitmentSerializer(serializers.ModelSerializer):
    member = MemberSerializer(read_only=True)

    class Meta:
        model = EventMemberCommitment
        fields = ["id", "hours", "member"]


class EventMemberCommitmentsResumeForOneUser(serializers.ModelSerializer):
    name = serializers.CharField(source="event.name")

    class Meta:
        model = EventMemberCommitment
        fields = ["id", "name", "hours"]


class CommentSerializer(serializers.ModelSerializer):
    login = serializers.ReadOnlyField(source="user.login")

    class Meta:
        model = Comment
        fields = ["id", "login", "content", "publication_date"]
        read_only_fields = ["id", "publication_date"]
