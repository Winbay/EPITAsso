from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics
from .models import Association
from .serializers import AssociationSerializer
from user.permissions import IsMemberOfAssociation


class AssociationListView(generics.ListCreateAPIView):
    queryset = Association.objects.all()
    serializer_class = AssociationSerializer

    @swagger_auto_schema(operation_summary="List all Associations")
    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Create an Association")
    def post(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


class AssociationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Association.objects.all()
    serializer_class = AssociationSerializer
    permission_classes = [IsMemberOfAssociation]

    @swagger_auto_schema(operation_summary="Retrieve an Association")
    def get(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Update an Association")
    def put(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Delete an Association")
    def delete(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
