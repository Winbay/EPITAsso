from django.urls import path
from .views import AssociationListView, AssociationDetailView, AssociationDetailsView, FaqListView, FaqDetailView, MemberDetailView, MemberListView

urlpatterns = [
    path("associations/", AssociationListView.as_view(), name="association-list"),
    path(
        "associations/<int:pk>/",
        AssociationDetailView.as_view(),
        name="association",
    ),
    path("associations/<int:pk>/details/", AssociationDetailsView.as_view(), name="association-details"),
    path("associations/<int:pk>/faqs/", FaqListView.as_view(), name="association-faqs"),
    path("associations/<int:pk>/faqs/<int:faq_id>/", FaqDetailView.as_view(), name="association-faq"),
    path("associations/<int:pk>/members/", MemberListView.as_view(), name="association-members"),
    path("associations/<int:pk>/members/<int:member_id>/", MemberDetailView.as_view(), name="association-member"),
]
