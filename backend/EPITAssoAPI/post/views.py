from drf_spectacular.utils import extend_schema
from rest_framework import generics

from association.models import Association
from .models import Tag, Post
from .serializers import TagSerializer, PostSerializer
from user.permissions import IsCustomAdmin


class TagListView(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def get_queryset(self):
        return Tag.objects.filter(type="post")

    @extend_schema(summary="List all Tags")
    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(summary="Create a Tag")
    def post(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


class TagDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsCustomAdmin]

    @extend_schema(summary="Retrieve a Tag")
    def get(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(summary="Update a Tag")
    def put(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @extend_schema(summary="Delete a Tag")
    def delete(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class PostListView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get_queryset(self):
        association_id = self.kwargs["association_id"]
        return Post.objects.filter(association_id=association_id)

    @extend_schema(summary="List all Posts")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(summary="Create a Post")
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        association_id = self.kwargs["association_id"]
        association = Association.objects.get(id=association_id)
        serializer.save(
            last_author=self.request.user,
            association=association,
            author=self.request.user,
        )


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    @extend_schema(summary="Retrieve a Post")
    def get(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(summary="Update a Post")
    def put(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @extend_schema(summary="Delete a Post")
    def delete(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    def perform_update(self, serializer):
        serializer.save(last_author=self.request.user)