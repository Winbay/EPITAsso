from django.contrib import admin
from .models import Association


@admin.register(Association)
class AssociationAdmin(admin.ModelAdmin):
    list_display = ("name", "location")
    search_fields = ("name", "location")
    filter_horizontal = ("members",)
    # list_filter = ('location',) # TODO uncomment this line once location is an enum or object
