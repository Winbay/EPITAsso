from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiParameter
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import generics, status
from django.utils.timezone import now
from rest_framework.pagination import LimitOffsetPagination
from .models import Event, EventMemberCommitment, Like, Comment
from .serializers import (
    EventMemberCommitmentSerializer,
    EventSerializer,
    CommentSerializer,
)


class UpcomingEventsView(generics.ListAPIView):
    serializer_class = EventSerializer
    queryset = Event.objects.all()
    permission_classes = [AllowAny]

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
        summary="Retrieve the 'limit' upcoming events (all associations) (default: 3)",
        description="Retrieve the 'limit' upcoming events, sorted by start date.",
        parameters=[
            OpenApiParameter(
                name="limit",
                type=int,
                required=False,
                location=OpenApiParameter.QUERY,
                description="Number of events to retrieve (default: 3)",
                default=3,
            )
        ],
    )
    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class EventListPaginationView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    pagination_class = LimitOffsetPagination
    permission_classes = [AllowAny]

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


class EventLikeView(generics.CreateAPIView, generics.DestroyAPIView):
    @extend_schema(
        summary="Like an event",
        description="Allows a user to like an event. If the user has already liked the event, an error will be returned.",
        responses={
            201: "Event liked successfully",
            400: "You have already liked this event",
        },
    )
    def post(self, request, pk):
        event = get_object_or_404(Event, id=pk)
        user = request.user
        if Like.objects.filter(user=user, event=event).exists():
            return Response(
                {"detail": "You have already liked this event."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        Like.objects.create(user=user, event=event)
        return Response(
            {"detail": "Event liked successfully."}, status=status.HTTP_201_CREATED
        )

    @extend_schema(
        summary="Unlike an event",
        description="Allows a user to unlike an event. If the user has not liked the event, an error will be returned.",
        responses={
            204: "Like removed successfully",
            400: "You haven't liked this event",
        },
    )
    def delete(self, request, pk):
        event = get_object_or_404(Event, id=pk)
        user = request.user

        like = Like.objects.filter(user=user, event=event).first()

        if like:
            like.delete()
            return Response(
                {"detail": "Like removed successfully."},
                status=status.HTTP_204_NO_CONTENT,
            )

        return Response(
            {"detail": "You haven't liked this event."},
            status=status.HTTP_400_BAD_REQUEST,
        )


class EventCommentCreateListView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    pagination_class = LimitOffsetPagination

    def perform_create(self, serializer):
        event = get_object_or_404(Event, id=self.kwargs["id"])
        serializer.save(user=self.request.user, event=event)

    def get_queryset(self):
        event_id = self.kwargs["id"]
        return Comment.objects.filter(event__id=event_id).order_by("-publication_date")


class EventCommentDeleteUpdateView(generics.DestroyAPIView, generics.GenericAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

    def get_object(self):
        comment = get_object_or_404(
            Comment, id=self.kwargs["commentId"], event_id=self.kwargs["id"]
        )
        if comment.user != self.request.user:
            return Response(
                {"detail": "You do not have permission to delete this comment."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return comment

    def perform_update(self, serializer):
        serializer.save()

    def patch(self, request, *args, **kwargs):
        comment = self.get_object()
        serializer = self.get_serializer(comment, data=request.data, partial=True)

        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)
