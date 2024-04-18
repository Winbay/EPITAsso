from django.contrib import admin
from .models import Tag, Post, Image

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at', 'updated_at',)
    search_fields = ('title', 'author', 'last_author')
    list_filter = ('created_at', 'updated_at', 'tags',)

@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('link',)
    search_fields = ('link',)

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'color',)
    search_fields = ('name',)
