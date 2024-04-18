from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics
from .models import Equipment
from .serializers import EquipmentSerializer

class EquipmentView(generics.ListCreateAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer

    @swagger_auto_schema(
        operation_summary="List all Equipment",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @swagger_auto_schema(
        operation_summary="Create Equipment",
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)