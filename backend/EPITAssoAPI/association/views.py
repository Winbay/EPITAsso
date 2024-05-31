from drf_spectacular.utils import extend_schema
from rest_framework import generics
from .models import Association
from .serializers import AssociationSerializer
from user.permissions import IsMemberOfAssociation


class AssociationListView(generics.ListCreateAPIView):
    queryset = Association.objects.all()
    serializer_class = AssociationSerializer

    @extend_schema(summary="List all Associations")
    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(summary="Create an Association")
    def post(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


class AssociationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Association.objects.all()
    serializer_class = AssociationSerializer
    permission_classes = [IsMemberOfAssociation]

    @extend_schema(summary="Retrieve an Association")
    def get(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(summary="Update an Association")
    def put(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @extend_schema(summary="Delete an Association")
    def delete(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
