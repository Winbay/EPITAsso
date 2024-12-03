from rest_framework import serializers
from .models import Image


class ImageModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = "image", "caption"
