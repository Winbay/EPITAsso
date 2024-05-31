from drf_spectacular.utils import extend_schema
from rest_framework import generics
from .models import Equipment
from .serializers import EquipmentSerializer


class EquipmentView(generics.ListCreateAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer

    @extend_schema(
        summary="List all Equipment",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        summary="Create Equipment",
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
