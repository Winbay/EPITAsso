from rest_framework import serializers
from .models import Event
from post.serializers import TagSerializer


class EventSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)
    author = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            "id",
            "author",
            # "association",
            "name",
            "content",
            "start_date",
            "end_date",
            "recurrent",
            "frequency",
            "end_recurrence",
            "tags",
        ]

    def get_author(self, obj):
        return obj.author.login

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
