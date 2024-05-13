from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "login",
        "email",
        "first_name",
        "last_name",
        "school",
        "is_custom_admin",
    )
    search_fields = ("login", "email", "name", "last_name", "first_name", "school")
    list_filter = ("is_custom_admin",)
