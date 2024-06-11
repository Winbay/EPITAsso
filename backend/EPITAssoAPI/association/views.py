from drf_spectacular.utils import extend_schema
from rest_framework import generics
from .models import AssociateUserAndAssociation, Association, Faq
from .serializers import AssociationDetailsSerializer, AssociationSerializer, FaqSerializer, MemberSerializer
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


class AssociationDetailsView(generics.RetrieveAPIView):
    queryset = Association.objects.all()
    serializer_class = AssociationDetailsSerializer
    permission_classes = [IsMemberOfAssociation]

    @extend_schema(summary="Retrieve an Association with a depth of 1")
    def get(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)


class FaqListView(generics.ListCreateAPIView):
    queryset = Faq.objects.all()
    serializer_class = FaqSerializer

    @extend_schema(summary="List all Faqs")
    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(summary="Create an Faq")
    def post(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


class FaqDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Faq.objects.all()
    serializer_class = FaqSerializer
    permission_classes = [IsMemberOfAssociation]

    @extend_schema(summary="Retrieve an Faq")
    def get(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(summary="Update an Faq")
    def put(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @extend_schema(summary="Delete an Faq")
    def delete(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
class MemberListView(generics.ListAPIView):
    queryset = AssociateUserAndAssociation.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [IsMemberOfAssociation]

    @extend_schema(summary="List all Members")
    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class MemberDetailView(generics.RetrieveUpdateAPIView):
    queryset = AssociateUserAndAssociation.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [IsMemberOfAssociation]

    @extend_schema(summary="Retrieve a Member")
    def get(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(summary="Update a Member")
    def put(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)