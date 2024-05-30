from django.contrib import admin
from .models import Event, Tag


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("name", "start_date", "end_date")
    search_fields = ("name", "start_date")
    list_filter = ("start_date",)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = (
        "name",
    )
    search_fields = ("name",)