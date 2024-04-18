from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics, mixins
from .models import Tag, Post, Image
from .serializers import TagSerializer, PostSerializer, ImageSerializer
from rest_framework.permissions import IsAuthenticated
from user.permissions import IsCustomAdmin

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


class TagListView(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(operation_summary="List all Tags")
    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Create a Tag")
    def post(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

class TagDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated, IsCustomAdmin]

    @swagger_auto_schema(operation_summary="Retrieve a Tag")
    def get(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Update a Tag")
    def put(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Delete a Tag")
    def delete(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

class PostListView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(operation_summary="List all Posts")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @swagger_auto_schema(operation_summary="Create a Post")
    def post(self, request, *args, **kwargs):
        print("test", request.data)
        return super().post(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
        serializer.save(last_author=self.request.user)


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(operation_summary="Retrieve a Post")
    def get(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Update a Post")
    def put(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Delete a Post")
    def delete(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
    def perform_update(self, serializer):
        serializer.save(last_author=self.request.user)

class ImageListView(generics.ListAPIView):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer

    @swagger_auto_schema(operation_summary="List all Images")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

class ImageDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer

    @swagger_auto_schema(operation_summary="Create an Image")
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)