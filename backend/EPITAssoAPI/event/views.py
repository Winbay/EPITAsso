from drf_spectacular.utils import extend_schema
from rest_framework import generics
from .models import Event
from .serializers import EventSerializer


class EventView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    @extend_schema(
        summary="List all Events",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        summary="Create an Event",
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
