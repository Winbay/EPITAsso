from rest_framework import serializers
from .models import Tag, Post, Image


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = "__all__"


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = "__all__"


class PostSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)
    author = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ["id", "title", "author", "content", "tags"]
        read_only_fields = ("author", "last_author")

    def get_author(self, obj):
        return obj.author.login

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        post = Post.objects.create(**validated_data)
        post.tags.set(self._get_tag_instances(tags_data))
        return post

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', [])

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
        tag_names = [tag['name'] for tag in tags_data if 'name' in tag]
        return Tag.objects.filter(name__in=tag_names)