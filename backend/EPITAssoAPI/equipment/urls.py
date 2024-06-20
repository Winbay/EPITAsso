from django.urls import path
from .views import (
    EquipmentListView,
    EquipmentDetailView,
    EquipmentRequestReceivedView,
    EquipmentRequestSentView,
    EquipmentRetrieveView,
    EquipmentBorrowView,
    EquipmentInvalidDatesView,
    EquipmentRequestListView,
    EquipmentRequestDetailView,
    EquipmentRequestAcceptView,
    EquipmentRequestRefuseView,
)

urlpatterns = [
    path("equipments/", EquipmentListView.as_view(), name="equipment-list"),
    path(
        "equipments/<int:pk>/", EquipmentDetailView.as_view(), name="equipment-detail"
    ),
    path(
        "equipments/<int:pk>/retrieve",
        EquipmentRetrieveView.as_view(),
        name="equipment-retrieve",
    ),
    path(
        "equipments/<int:pk>/borrow",
        EquipmentBorrowView.as_view(),
        name="equipment-borrow",
    ),
    path(
        "equipments/<int:pk>/invalid-dates",
        EquipmentInvalidDatesView.as_view(),
        name="equipment-invalid-dates",
    ),
    path(
        "equipments/requests/",
        EquipmentRequestListView.as_view(),
        name="equipment-request-list",
    ),
    path(
        "equipments/requests/received/",
        EquipmentRequestReceivedView.as_view(),
        name="equipment-request-received-list",
    ),
    path(
        "equipments/requests/sent/",
        EquipmentRequestSentView.as_view(),
        name="equipment-request-sent-list",
    ),
    # TODO: Not used
    path(
        "equipments/requests/<int:pk>/",
        EquipmentRequestDetailView.as_view(),
        name="equipment-request-detail",
    ),
    path(
        "equipments/requests/<int:pk>/accept",
        EquipmentRequestAcceptView.as_view(),
        name="equipment-request-accept",
    ),
    path(
        "equipments/requests/<int:pk>/refuse",
        EquipmentRequestRefuseView.as_view(),
        name="equipment-request-refuse",
    ),
]
