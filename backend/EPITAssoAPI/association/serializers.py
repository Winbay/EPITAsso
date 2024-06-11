from rest_framework import serializers
from user.serializers import UserLoginSerializer
from .models import AssociateUserAndAssociation, Association, Faq


class AssociationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Association
        fields = ['id', 'name', 'content', 'logo', 'location']
        read_only_fields = ['id']


class FaqSerializer(serializers.ModelSerializer):
    class Meta:
        model = Faq
        fields = ['id', 'question', 'answer']
        read_only_fields = ['id']


class AssociationDetailsSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField()
    faqs = FaqSerializer(many=True, read_only=True)

    class Meta:
        model = Association
        fields = ['id', 'name', 'content', 'logo', 'location', 'faqs', 'members']
        read_only_fields = ['id', 'name', 'content', 'logo', 'location', 'faqs', 'members']
        depth = 1

    def get_members(self, obj):
        associated_users = AssociateUserAndAssociation.objects.filter(association=obj)
        users = [association.user for association in associated_users]
        return UserLoginSerializer(users, many=True).data
    
class MemberSerializer(serializers.ModelSerializer):
    user = UserLoginSerializer(read_only=True)

    class Meta:
        model = AssociateUserAndAssociation
        fields = ['id', 'user', 'role']
        read_only_fields = ['id', 'user']