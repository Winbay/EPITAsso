from drf_spectacular.utils import extend_schema
from rest_framework import generics
from .models import AssociateUserAndAssociation, Association, Faq, SocialNetwork
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


class AssociationDetailsView(generics.RetrieveUpdateAPIView):
    queryset = Association.objects.all()
    serializer_class = AssociationDetailsSerializer
    permission_classes = [IsMemberOfAssociation]

    @extend_schema(summary="Retrieve an Association with a depth of 1")
    def get(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
    
    @extend_schema(summary="Update an Association")
    def put(self, request, *args, **kwargs):
        print(request.data, args, kwargs)
        new_faqs = request.data.get('faqs', [])
        self.__update_faqs(new_faqs, self.get_object())
        social_networks = request.data.get('social_networks', [])
        self.__update_social_networks(social_networks, self.get_object())
        return super().update(request, *args, **kwargs)
    
    def __update_faqs(self, faqs_data, instance):
        existing_faqs = list(instance.faqs.all())
        existing_faq_ids = [faq.id for faq in existing_faqs]

        for faq_data in faqs_data:
            if faq_data['id'] is None or faq_data['id'] == -1:
                faq_data.pop('id', None)
                Faq.objects.create(association=instance, **faq_data)
            elif faq_data['id'] in existing_faq_ids:
                faq = Faq.objects.get(id=faq_data['id'])
                for attr, value in faq_data.items():
                    setattr(faq, attr, value)
                faq.save()
                existing_faq_ids.remove(faq_data['id'])
        
        for faq_id in existing_faq_ids:
            Faq.objects.get(id=faq_id).delete()

    def __update_social_networks(self, social_networks_data, instance):
        existing_social_networks = list(instance.social_networks.all())
        existing_social_network_ids = [social_network.id for social_network in existing_social_networks]

        for social_network_data in social_networks_data:
            if social_network_data['id'] is None or social_network_data['id'] == -1:
                social_network_data.pop('id', None)
                SocialNetwork.objects.create(association=instance, **social_network_data)
            elif social_network_data['id'] in existing_social_network_ids:
                social_network = SocialNetwork.objects.get(id=social_network_data['id'])
                for attr, value in social_network_data.items():
                    setattr(social_network, attr, value)
                social_network.save()
                existing_social_network_ids.remove(social_network_data['id'])
        
        for social_network_id in existing_social_network_ids:
            SocialNetwork.objects.get(id=social_network_id).delete()


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
    
    def get_queryset(self):
        association_id = self.kwargs['pk']
        return AssociateUserAndAssociation.objects.filter(association_id=association_id)


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