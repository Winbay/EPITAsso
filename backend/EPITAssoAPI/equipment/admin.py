from django.contrib import admin
from .models import Equipment


@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "owner",
        "borrower",
        "borrowing_date",
        "due_date",
        "owner_resp",
        "borrower_resp",
        "quantity",
    )
    search_fields = (
        "name",
        "owner",
        "borrower",
        "borrowing_date",
        "due_date",
        "owner_resp",
        "borrower_resp",
        "quantity",
    )
    list_filter = ("borrowing_date", "due_date", "quantity")
