from drf_spectacular.utils import extend_schema, OpenApiExample
from rest_framework.response import Response
from rest_framework import generics, status
from django.utils.timezone import now
from rest_framework.pagination import LimitOffsetPagination
from .models import Event, EventMemberCommitment
from .serializers import (
    EventMemberCommitmentSerializer,
    EventSerializer,
)


class UpcomingEventsView(generics.ListAPIView):
    serializer_class = EventSerializer
    queryset = Event.objects.all()

    def get_queryset(self):
        limit = self.request.query_params.get("limit", 3)
        try:
            limit = int(limit)
            if limit <= 0:
                limit = 3
        except ValueError:
            limit = 3
        return Event.objects.filter(start_date__gte=now()).order_by("start_date")[
            :limit
        ]

    @extend_schema(
        summary="Retrieve the 'limit' upcoming events (all associations) (default: 3)"
    )
    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class EventListPaginationView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        return super().get_queryset().order_by("-start_date")

    @extend_schema(summary="List all Events of all Associations with pagination")
    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class EventMemberCommitmentListView(generics.ListAPIView):
    queryset = EventMemberCommitment.objects.all()
    serializer_class = EventMemberCommitmentSerializer

    def get_queryset(self):
        event_id = self.kwargs["pk"]
        return EventMemberCommitment.objects.filter(event_id=event_id)

    @extend_schema(summary="List all EventMemberCommitments of an Event")
    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class EventMemberCommitmentBulkUpdateView(generics.UpdateAPIView):
    queryset = EventMemberCommitment.objects.all()
    serializer_class = EventMemberCommitmentSerializer

    @extend_schema(
        summary="Bulk update EventMemberCommitments",
        description=(
            "This endpoint allows bulk updating of multiple EventMemberCommitments. "
            "Each commitment must be identified by its ID, and the `hours` field can be updated. "
            "The request body should be a list of objects, each containing an `id` and any fields to be updated."
        ),
        request={
            "application/json": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "integer",
                            "example": 1,
                            "description": "The ID of the EventMemberCommitment to update",
                        },
                        "hours": {
                            "type": "integer",
                            "example": 5,
                            "description": "Number of hours committed",
                        },
                    },
                    "required": ["id"],
                },
            }
        },
        responses={
            status.HTTP_200_OK: OpenApiExample(
                "Success",
                summary="Successful update",
                value=[
                    {"id": 1, "member": 1, "hours": 5},
                    {"id": 2, "member": 2, "hours": 3},
                ],
            ),
            status.HTTP_400_BAD_REQUEST: OpenApiExample(
                "Invalid request",
                summary="Invalid request data",
                value={"error": "Request data should be a list of commitments"},
            ),
            status.HTTP_404_NOT_FOUND: OpenApiExample(
                "Commitment not found",
                summary="Commitment not found",
                value={"error": "EventMemberCommitment with ID 5 not found"},
            ),
        },
    )
    def patch(self, request, *args, **kwargs):
        commitments_data = request.data

        if not isinstance(commitments_data, list):
            return Response(
                {"error": "Request data should be a list of commitments"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        updated_commitments = []

        for commitment_data in commitments_data:
            try:
                commitment_instance = EventMemberCommitment.objects.get(
                    id=commitment_data["id"]
                )
            except EventMemberCommitment.DoesNotExist:
                return Response(
                    {
                        "error": f"EventMemberCommitment with ID {commitment_data['id']} not found"
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )

            serializer = self.get_serializer(
                commitment_instance, data=commitment_data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                updated_commitments.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(updated_commitments, status=status.HTTP_200_OK)
