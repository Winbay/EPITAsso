from django.contrib import admin
from .models import Event, EventMemberCommitment


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "start_date", "end_date")
    search_fields = ("name", "start_date")
    list_filter = ("start_date",)


@admin.register(EventMemberCommitment)
class EventMemberCommitmentAdmin(admin.ModelAdmin):
    list_display = ("id", "hours", "member")
    search_fields = ("hours", "member")
