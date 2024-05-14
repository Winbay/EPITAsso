from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics
from .models import Association
from .serializers import AssociationSerializer


class AssociationView(generics.ListCreateAPIView):
    queryset = Association.objects.all()
    serializer_class = AssociationSerializer

    @swagger_auto_schema(
        operation_summary="List all associations",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Create an association",
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
