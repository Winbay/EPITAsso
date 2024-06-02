from django.contrib import admin
from .models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from user.forms import CustomUserCreationForm, CustomUserChangeForm


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    add_form=CustomUserCreationForm
    form=CustomUserChangeForm
    model=User

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("login",)
            },
        ),
    )

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (
            "Personal info",
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "email",
                    "login",
                    "school",
                    "microsoft_id",
                )
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "is_custom_admin",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )
    list_display = (
        "email",
        "login",
        "first_name",
        "last_name",
        "school",
        "is_custom_admin",
        "is_staff",
        "is_superuser",
    )
    search_fields = ("login", "email", "first_name", "last_name", "school")
    list_filter = ("is_custom_admin", "is_staff", "is_superuser", "school")
