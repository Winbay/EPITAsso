from django.contrib import admin
from .models import Association, AssociateUserAndAssociation

@admin.register(AssociateUserAndAssociation)
class AssociateUserAndAssociationAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "association", "role")
    search_fields = ("user", "association", "role")

@admin.register(Association)
class AssociationAdmin(admin.ModelAdmin):
    list_display = ("name", "id", "location")
    search_fields = ("name", "location")
    # list_filter = ('location',) # TODO uncomment this line once location is an enum or object
