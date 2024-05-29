from rest_framework import serializers
from .models import User

class LoginUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'login', 'first_name', 'last_name', 'email', 'school']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
        # extra_kwargs = {
        #     'id': {
        #         'read_only': True,
        #         'help_text': 'Unique identifier of the user'
        #     },
        #     'login': {
        #         'help_text': 'Unique login for the user'
        #     },
        #     'email': {
        #         'help_text': 'Custom user email address (can be different from the login)'
        #     },
        #     'name': {
        #         'help_text': 'First name'
        #     },
        #     'lastname': {
        #         'help_text': 'Last name'
        #     },
        #     'school': {
        #         'help_text': 'School name'
        #     },
        #     'is_custom_admin': {
        #         'help_text': 'Designates if the user has access to the admin panel or not'
        #     },
        # }
