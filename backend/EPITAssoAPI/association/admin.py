from django.contrib import admin
from .models import (
    Association,
    AssociateUserAndAssociation,
    Commitment,
    Faq,
    MemberCommitment,
    SocialNetwork,
    AssociationFavorite
)


@admin.register(AssociateUserAndAssociation)
class AssociateUserAndAssociationAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "association", "role")
    search_fields = ("user", "association", "role")
    list_filter = ("association", "user", "role")


@admin.register(Association)
class AssociationAdmin(admin.ModelAdmin):
    list_display = ("name", "id", "location", "type", "slug")
    search_fields = ("name", "location")
    # list_filter = ('location',) # TODO uncomment this line once location is an enum or object


@admin.register(Faq)
class FaqAdmin(admin.ModelAdmin):
    list_display = ("id", "question", "association")
    search_fields = ("question", "association")


@admin.register(SocialNetwork)
class SocialNetworkAdmin(admin.ModelAdmin):
    list_display = ("name", "link", "association")
    search_fields = ("name", "link", "association")


@admin.register(Commitment)
class CommitmentAdmin(admin.ModelAdmin):
    list_display = ("id", "association", "start_date", "end_date")
    search_fields = ("association", "start_date", "end_date")
    list_filter = ("association",)


@admin.register(MemberCommitment)
class MemberCommitmentAdmin(admin.ModelAdmin):
    list_display = ("id", "hours", "member")
    search_fields = ("hours", "member")
    list_filter = ("member",)

@admin.register(AssociationFavorite)
class AssociationFavoriteAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "association")
    search_fields = ("user", "association")
    list_filter = ("user", "association")
