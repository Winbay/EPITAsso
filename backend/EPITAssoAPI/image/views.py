from rest_framework import generics, status
from .serializers import ImageModelSerializer
from .models import Image
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination
from .mixins import AssociationPermissionMixin
from drf_spectacular.utils import extend_schema, OpenApiParameter

# Create your views here.
class ImageUploadView(generics.GenericAPIView):
    queryset = Image.objects.all()
    serializer_class = ImageModelSerializer

    @extend_schema(
        summary="Upload an Image",
        responses=ImageModelSerializer
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(association=request.association)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    summary="List all Images of an Association",
    parameters=[
        OpenApiParameter(
            name='association_id',
            description="ID of the association",
            required=True,
            type=int,
            location=OpenApiParameter.PATH
        ),
        OpenApiParameter(
            name='limit',
            description="Number of results to return",
            required=False,
            type=int,
            location=OpenApiParameter.QUERY
        ),
        OpenApiParameter(
            name='offset',
            description="Initial offset in the results",
            required=False,
            type=int,
            location=OpenApiParameter.QUERY
        ),
    ],
    responses=ImageModelSerializer(many=True)
)
class ImageListView(generics.ListAPIView):
    serializer_class = ImageModelSerializer
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        association_id = self.kwargs.get('association_id')
        return Image.objects.filter(association_id=association_id)


class ImageDetailUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Image.objects.all()
    serializer_class = ImageModelSerializer

    @extend_schema(
        summary="Retrieve an Image",
        responses=ImageModelSerializer
    )
    def get(self, request, *args, **kwargs):
        response = self.check_association(request)
        if response:
            return response
        return self.retrieve(request, *args, **kwargs)

    @extend_schema(
        summary="Update an Image",
        request=ImageModelSerializer,
        responses=ImageModelSerializer
    )
    def put(self, request, *args, **kwargs):
        response = self.check_association(request)
        if response:
            return response

        request.data['association'] = request.association.id
        return self.update(request, *args, **kwargs, partial=False)

    @extend_schema(
        summary="Partially Update an Image",
        request=ImageModelSerializer,
        responses=ImageModelSerializer
    )
    def patch(self, request, *args, **kwargs):
        response = self.check_association(request)
        if response:
            return response

        request.data['association'] = request.association.id
        return self.update(request, *args, **kwargs, partial=True)


class ImageDeleteView(generics.DestroyAPIView):
    queryset = Image.objects.all()
    serializer_class = ImageModelSerializer

    @extend_schema(
        summary="Delete an Image",
        responses=None
    )
    def delete(self, request, *args, **kwargs):
        response = self.check_association(request)
        if response:
            return response
        return self.destroy(request, *args, **kwargs)