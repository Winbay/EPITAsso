from django.contrib import admin
from .models import Message, Conversation


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("content", "author", "association_sender", "sent_at")
    search_fields = ("content", "author", "association_sender", "sent_at")
    list_filter = ("sent_at",)


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
