from rest_framework import serializers
from .models import (
    AssociateUserAndAssociation,
    Association,
    Commitment,
    Faq,
    MemberCommitment,
    SocialNetwork,
)


class AssociationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Association
        fields = [
            "id",
            "name",
            "content",
            "logo",
            "location",
            "webhook",
            "category",
            "type",
            "slug",
        ]
        read_only_fields = ["id"]


class FaqSerializer(serializers.ModelSerializer):
    class Meta:
        model = Faq
        fields = ["id", "question", "answer"]
        read_only_fields = ["id"]


class SocialNetworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialNetwork
        fields = ["id", "name", "link"]
        read_only_fields = ["id"]


class AssociationDetailsSerializer(serializers.ModelSerializer):
    faqs = FaqSerializer(many=True, read_only=True)
    social_networks = SocialNetworkSerializer(many=True, read_only=True)

    class Meta:
        model = Association
        fields = [
            "id",
            "name",
            "content",
            "logo",
            "location",
            "webhook",
            "faqs",
            "social_networks",
            "category",
            "type",
            "slug",
        ]
        read_only_fields = ["id"]
        depth = 1


class AssociationSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Association
        fields = ["id", "name"]
        read_only_fields = ["id", "name"]


class AssociationSimpleWithLogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Association
        fields = ["id", "name", "logo", "slug"]
        read_only_fields = ["id", "name", "logo", "slug"]


class MemberSerializer(serializers.ModelSerializer):
    login = serializers.CharField(source="user.login")
    first_name = serializers.CharField(source="user.first_name")
    last_name = serializers.CharField(source="user.last_name")
    school = serializers.CharField(source="user.school")

    class Meta:
        model = AssociateUserAndAssociation
        fields = ["id", "role", "login", "first_name", "last_name", "school"]
        read_only_fields = ["id", "role", "login", "first_name", "last_name", "school"]


class AssociationListPaginationSerializer(serializers.ModelSerializer):
    social_networks = SocialNetworkSerializer(many=True, read_only=True)

    class Meta:
        model = Association
        fields = [
            "id",
            "name",
            "content",
            "logo",
            "slug",
            "social_networks",
        ]
        read_only_fields = ["id"]
        depth = 1


class CommitmentSerializer(serializers.ModelSerializer):
    member_commitments = serializers.SerializerMethodField()

    class Meta:
        model = Commitment
        fields = ["id", "start_date", "end_date", "member_commitments"]
        read_only_fields = ["id"]

    def get_member_commitments(self, obj):
        commitments = MemberCommitment.objects.filter(commitment=obj)
        return MemberCommitmentSerializer(commitments, many=True).data


class MemberCommitmentSerializer(serializers.ModelSerializer):
    member = MemberSerializer()

    class Meta:
        model = MemberCommitment
        fields = ["id", "hours", "member"]
        read_only_fields = ["id", "member"]
