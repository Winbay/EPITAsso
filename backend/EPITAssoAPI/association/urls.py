from django.urls import path
from .views import (
    AssociationListPaginationView,
    AssociationGetBDEView,
    AssociationListView,
    AssociationDetailView,
    AssociationDetailsView,
    AssociationSlugView,
    FaqListView,
    FaqDetailView,
    LargestAssociationView,
    MemberDetailView,
    MemberListView,
)

urlpatterns = [
    path("associations/", AssociationListView.as_view(), name="associations"),
    path("associations/list/", AssociationListPaginationView.as_view(), name="association-list"),
    path(
        "associations/<int:pk>/",
        AssociationDetailView.as_view(),
        name="association",
    ),
    path(
        "associations/slug/<slug:slug>/",
        AssociationSlugView.as_view(),
        name="association-slug",
    ),
    path(
        "associations/<int:pk>/details/",
        AssociationDetailsView.as_view(),
        name="association-details",
    ),
    path("associations/<int:pk>/faqs/", FaqListView.as_view(), name="association-faqs"),
    path(
        "associations/<int:pk>/faqs/<int:faq_id>/",
        FaqDetailView.as_view(),
        name="association-faq",
    ),
    path(
        "associations/<int:pk>/members/",
        MemberListView.as_view(),
        name="association-members",
    ),
    path(
        "associations/<int:pk>/members/<int:member_id>/",
        MemberDetailView.as_view(),
        name="association-member",
    ),
    path('associations/largest/', LargestAssociationView.as_view(), name='largest-associations'),
    path('associations/bde/', AssociationGetBDEView.as_view(), name='associations-bde'),
]
