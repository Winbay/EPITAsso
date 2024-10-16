from django.urls import path
from .views import (
    AssociationListPaginationView,
    AssociationGetBDEView,
    AssociationListView,
    AssociationDetailView,
    AssociationDetailsView,
    AssociationSlugView,
    CommitmentDetailView,
    CommitmentListView,
    FaqListView,
    FaqDetailView,
    MemberCommitmentBulkUpdateView,
    ResumeAllCommitmentsView,
    ResumeEventsCommitmentsForOneMemberView,
    LargestAssociationView,
    MemberDetailView,
    MemberListView,
    AssociationFavoriteView,
    AssociationFavoriteDeleteView,
)

urlpatterns = [
    path("associations/", AssociationListView.as_view(), name="associations"),
    path(
        "associations/list/",
        AssociationListPaginationView.as_view(),
        name="association-list",
    ),
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
    path(
        "associations/largest/",
        LargestAssociationView.as_view(),
        name="largest-associations",
    ),
    path("associations/bde/", AssociationGetBDEView.as_view(), name="associations-bde"),
    path(
        "associations/<int:pk>/commitments/",
        CommitmentListView.as_view(),
        name="association-commitments",
    ),
    path(
        "associations/<int:pk>/commitments/<int:commitment_id>/",
        CommitmentDetailView.as_view(),
        name="association-commitment",
    ),
    path(
        "associations/<int:pk>/commitments/resume-all/",
        ResumeAllCommitmentsView.as_view(),
        name="resume-all-commitments",
    ),
    path(
        "associations/<int:pk>/commitments/resume/<int:member_id>/",
        ResumeEventsCommitmentsForOneMemberView.as_view(),
        name="resume-all-commitments",
    ),
    path(
        "associations/<int:pk>/commitments/bulk-update/",
        MemberCommitmentBulkUpdateView.as_view(),
        name="bulk-update-commitments",
    ),
    path('associations/favorites/', AssociationFavoriteView.as_view(), name='favorite-list-add'),
    path('associations/favorites/<int:association_id>/', AssociationFavoriteDeleteView.as_view(), name='favorite-delete'),
]
