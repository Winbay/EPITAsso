from rest_framework import serializers

from association.serializers import (
    AssociationSimpleWithLogoSerializer,
)
from user.serializers import UserSimpleSerializer
from .models import Equipment, EquipmentRequest


class EquipmentRequestSerializer(serializers.ModelSerializer):
    asso_borrower = AssociationSimpleWithLogoSerializer(read_only=True)
    asso_owner = AssociationSimpleWithLogoSerializer(read_only=True)
    user_respo_borrower = UserSimpleSerializer(read_only=True)
    user_respo_owner = UserSimpleSerializer(read_only=True)
    borrowing_date = serializers.IntegerField()
    due_date = serializers.IntegerField()

    class Meta:
        model = EquipmentRequest
        fields = [
            "id",
            "asso_owner",
            "user_respo_owner",
            "asso_borrower",
            "user_respo_borrower",
            "borrowing_date",
            "due_date",
            "status",
            "comment",
            "equipment_id",
            "equipment_name",
        ]


class EquipmentRequestSimpleSerializer(serializers.ModelSerializer):
    user_respo_owner = UserSimpleSerializer(read_only=True)

    class Meta:
        model = EquipmentRequest
        fields = ["id", "status", "comment", "user_respo_owner"]


class EquipmentSerializer(serializers.ModelSerializer):
    asso_owner = AssociationSimpleWithLogoSerializer(read_only=True)
    equipment_request = EquipmentRequestSerializer(read_only=True)

    class Meta:
        model = Equipment
        fields = ["id", "name", "asso_owner", "quantity", "equipment_request", "photo"]
        read_only_fields = ["asso_owner", "equipment_request"]
