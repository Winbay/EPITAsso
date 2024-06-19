from django.contrib import admin
from .models import Equipment, EquipmentRequest

@admin.register(EquipmentRequest)
class EquipmentRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'asso_borrower', 'user_respo_borrower', 'status', 'comment')
    search_fields = ('equipment_name', 'status',)
    list_filter = ('status', 'asso_borrower')

@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'asso_owner', 'quantity', 'photo')
    search_fields = ('name',)
    list_filter = ('asso_owner',)
    ordering = ('name',)