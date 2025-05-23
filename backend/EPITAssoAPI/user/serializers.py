from rest_framework import serializers
from .models import User


class DetailUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "login", "first_name", "last_name", "email", "school"]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "login", "first_name", "last_name", "school"]
        # read_only_fields = ["id", "login"]


class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "login"]
        read_only_fields = ["id", "login"]


class UserWithLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["login"]
