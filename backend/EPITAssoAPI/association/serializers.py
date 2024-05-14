from rest_framework import serializers
from .models import Association


class AssociationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Association
        fields = "__all__"
        extra_kwargs = {
            "id": {
                "read_only": True,
                "help_text": "Unique identifier of the association",
            },
            "name": {"help_text": "Name of the association"},
            "location": {"help_text": "Location of the association's headquarters"},
        }
