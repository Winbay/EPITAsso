from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from rest_framework import generics
from django.utils.timezone import now
from rest_framework.pagination import LimitOffsetPagination
from association.models import Association
from .models import Event
from post.models import Tag
from .serializers import EventSerializer, TagSerializer
from user.permissions import IsCustomAdmin


class TagListView(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def get_queryset(self):
        return Tag.objects.filter(type="event")

    @extend_schema(summary="List all Tags")
    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(summary="Create a Tag")
    def post(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


class TagDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsCustomAdmin]

    @extend_schema(summary="Retrieve a Tag")
    def get(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(summary="Update a Tag")
    def put(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @extend_schema(summary="Delete a Tag")
    def delete(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class EventPagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 100

class EventListView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    pagination_class = EventPagination

    def get_queryset(self):
        association_id = self.kwargs["association_id"]
        return Event.objects.filter(association_id=association_id)

    @extend_schema(summary="List all Events",
        parameters=[
            OpenApiParameter(
                name="limit",
                description="Number of results to return",
                required=False,
                type=int,
                location=OpenApiParameter.QUERY,
            ),
            OpenApiParameter(
                name="offset",
                description="Initial offset in the results",
                required=False,
                type=int,
                location=OpenApiParameter.QUERY,
            ),
        ],
        responses=EventSerializer(many=True),
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(summary="Create an Event")
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        association_id = self.kwargs["association_id"]
        association = Association.objects.get(id=association_id)
        serializer.save(author=self.request.user, association=association)


class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    @extend_schema(summary="Retrieve an Event")
    def get(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(summary="Update an Event")
    def put(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @extend_schema(summary="Delete an Event")
    def delete(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


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
