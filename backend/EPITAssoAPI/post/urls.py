from django.urls import path, include
from .views import TagListView, TagDetailView, ImageListView, ImageDetailView, PostListView, PostDetailView

urlpatterns = [
    path('posts/', PostListView.as_view(), name='post-list'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('posts/tags/', TagListView.as_view(), name='tag-list'),
    path('posts/tags/<int:pk>/', TagDetailView.as_view(), name='tag-detail'),
    path('images/', ImageListView.as_view(), name='image-list'),
    path('images/<int:pk>/', ImageDetailView.as_view(), name='image-detail'),
]