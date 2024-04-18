from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics
from .models import Event
from .serializers import EventSerializer

class EventView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    @swagger_auto_schema(
        operation_summary="List all Events",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @swagger_auto_schema(
        operation_summary="Create an Event",
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)