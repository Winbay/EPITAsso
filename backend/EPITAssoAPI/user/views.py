from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics
from .models import User
from .serializers import UserSerializer

class UserView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @swagger_auto_schema(
        operation_summary="List all users",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @swagger_auto_schema(
        operation_summary="Create an user",
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)