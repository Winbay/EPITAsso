import os
from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework import generics, serializers, status
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination
from django.utils import timezone
from django.db.models import Q, Subquery, Case, When, Value, IntegerField
from association.models import Association
from .models import Equipment, EquipmentRequest
from .serializers import (
    EquipmentRequestSimpleSerializer,
    EquipmentSerializer,
    EquipmentRequestSerializer,
)


class EquipmentPagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 100


class EquipmentListView(generics.ListCreateAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    pagination_class = EquipmentPagination

    @extend_schema(
        summary="List all Equipments",
        parameters=[
            OpenApiParameter(
                name="limit",
                description="Number of results to return",
                required=False,
                type=int,
                location=OpenApiParameter.QUERY,
            ),
            OpenApiParameter(
                name="offset",
                description="Initial offset in the results",
                required=False,
                type=int,
                location=OpenApiParameter.QUERY,
            ),
        ],
        responses=EquipmentSerializer(many=True),
    )
    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(summary="Create an Equipment")
    def post(self, request, *args, **kwargs):
        association = getattr(request, "association")

        data = request.data.copy()
        data["asso_owner"] = kwargs.get("association_id")
        data["equipment_request"] = None

        photo = request.FILES.get("photo")
        if not photo:
            data["photo"] = None

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save(asso_owner=association)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EquipmentStockListView(generics.ListAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    pagination_class = EquipmentPagination

    @extend_schema(
        summary="List all Equipments in stock",
        parameters=[
            OpenApiParameter(
                name="limit",
                description="Number of results to return",
                required=False,
                type=int,
                location=OpenApiParameter.QUERY,
            ),
            OpenApiParameter(
                name="offset",
                description="Initial offset in the results",
                required=False,
                type=int,
                location=OpenApiParameter.QUERY,
            ),
        ],
        responses=EquipmentSerializer(many=True),
    )
    def get(self, request, *args, **kwargs):
        association = getattr(request, "association")
        if association:
            self.queryset = self.queryset.filter(asso_owner=association)
        return super().get(request, *args, **kwargs)


class EquipmentOtherListView(generics.ListAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    pagination_class = EquipmentPagination

    @extend_schema(
        summary="List all Equipments not owned by the Association",
        parameters=[
            OpenApiParameter(
                name="limit",
                description="Number of results to return",
                required=False,
                type=int,
                location=OpenApiParameter.QUERY,
            ),
            OpenApiParameter(
                name="offset",
                description="Initial offset in the results",
                required=False,
                type=int,
                location=OpenApiParameter.QUERY,
            ),
        ],
        responses=EquipmentSerializer(many=True),
    )
    def get(self, request, *args, **kwargs):
        association = getattr(request, "association")
        if association:
            self.queryset = self.queryset.exclude(asso_owner=association)
        return super().get(request, *args, **kwargs)


class EquipmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer

    def patch(self, request, *args, **kwargs):
        equipment = self.get_object()
        old_photo = equipment.photo.path if equipment.photo else None

        data = request.data.copy()

        if "photo" in request.FILES:
            equipment.photo = request.FILES["photo"]

        serializer = self.get_serializer(equipment, data=data, partial=True)

        if serializer.is_valid():
            if old_photo and "photo" in request.FILES:
                if os.path.exists(old_photo):
                    os.remove(old_photo)

            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EquipmentRetrieveView(generics.UpdateAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer

    @extend_schema(summary="Retrieve an Equipment (set equipment_request to None)")
    def patch(self, request, *args, **kwargs):
        equipment = self.get_object()
        equipment.equipment_request = None
        equipment.save()
        serializer = self.get_serializer(equipment)
        return Response(serializer.data, status=status.HTTP_200_OK)


class EquipmentBorrowView(generics.CreateAPIView):
    queryset = EquipmentRequest.objects.all()
    serializer_class = EquipmentRequestSerializer

    def post(self, request, *args, **kwargs):
        equipment_id = request.data.get("equipment_id")
        borrowing_date = request.data.get("borrowing_date")
        due_date = request.data.get("due_date")

        equipment = self.__get_equipment(equipment_id)

        request.data.update(
            {
                "borrowing_date": borrowing_date,
                "due_date": due_date,
                "status": "waiting",
                "comment": "",
                "equipment_id": equipment_id,
                "equipment_name": equipment.name,
            }
        )

        # Initialize the serializer with the updated data
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            association_borrower = getattr(request, "association")
            asso_owner = equipment.asso_owner

            serializer.save(
                user_respo_borrower=request.user,
                asso_borrower=association_borrower,
                asso_owner=asso_owner,
                user_respo_owner=None,
            )

            # TODO improve this
            # Equipment.objects.filter(id=equipment_id).update(
            #     equipment_request=equipment_request
            # )
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def __get_equipment(self, equipment_id):
        try:
            equipment = Equipment.objects.get(id=equipment_id)
        except Equipment.DoesNotExist:
            raise serializers.ValidationError("Invalid equipment ID")
        return equipment


class EquipmentInvalidDatesView(generics.ListAPIView):
    queryset = EquipmentRequest.objects.all()
    serializer_class = EquipmentSerializer

    def get_queryset(self):
        now = int(timezone.now().timestamp())
        return self.queryset.filter(status="accepted").filter(
            Q(borrowing_date__gt=now) & Q(due_date__lt=now)
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        invalid_dates = [
            (request.borrowing_date, request.due_date) for request in queryset
        ]
        return Response(invalid_dates, status=status.HTTP_200_OK)


class EquipmentRequestListView(generics.ListCreateAPIView):
    queryset = EquipmentRequest.objects.all()
    serializer_class = EquipmentRequestSerializer


class EquipmentRequestPagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 100


class EquipmentRequestReceivedView(generics.ListAPIView):
    serializer_class = EquipmentRequestSerializer
    pagination_class = EquipmentRequestPagination

    @extend_schema(
        summary="List all Equipment Requests received by an Association",
        parameters=[
            OpenApiParameter(
                name="limit",
                description="Number of results to return",
                required=False,
                type=int,
                location=OpenApiParameter.QUERY,
            ),
            OpenApiParameter(
                name="offset",
                description="Initial offset in the results",
                required=False,
                type=int,
                location=OpenApiParameter.QUERY,
            ),
        ],
        responses=EquipmentRequestSerializer(many=True),
    )
    def get_queryset(self):
        association_id = self.kwargs.get("association_id")

        # Sous-requête pour filtrer les ID des équipements de l'association
        equipments = Equipment.objects.filter(asso_owner_id=association_id).values("id")

        # Filtrer les demandes d'équipement où equipment_id est dans les IDs des équipements de l'association
        queryset = EquipmentRequest.objects.filter(
            equipment_id__in=Subquery(equipments)
        )

        queryset = queryset.annotate(
            status_order=Case(
                When(status="waiting", then=Value(1)),
                When(status="accepted", then=Value(2)),
                When(status="refused", then=Value(3)),
                output_field=IntegerField(),
            )
        ).order_by("status_order", "id")

        return queryset


class EquipmentRequestSentView(generics.ListAPIView):
    serializer_class = EquipmentRequestSerializer
    pagination_class = EquipmentRequestPagination

    @extend_schema(
        summary="List all Equipment Requests sent by an Association",
        parameters=[
            OpenApiParameter(
                name="limit",
                description="Number of results to return",
                required=False,
                type=int,
                location=OpenApiParameter.QUERY,
            ),
            OpenApiParameter(
                name="offset",
                description="Initial offset in the results",
                required=False,
                type=int,
                location=OpenApiParameter.QUERY,
            ),
        ],
        responses=EquipmentRequestSerializer(many=True),
    )
    def get_queryset(self):
        queryset = EquipmentRequest.objects.filter(
            asso_borrower=self.kwargs.get("association_id")
        )

        queryset = queryset.annotate(
            status_order=Case(
                When(status="waiting", then=Value(1)),
                When(status="accepted", then=Value(2)),
                When(status="refused", then=Value(3)),
                output_field=IntegerField(),
            )
        ).order_by("status_order", "id")

        return queryset


class EquipmentRequestDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = EquipmentRequest.objects.all()
    serializer_class = EquipmentRequestSerializer


class EquipmentRequestAcceptView(generics.UpdateAPIView):
    queryset = EquipmentRequest.objects.all()
    serializer_class = EquipmentRequestSimpleSerializer

    @extend_schema(summary="Accept an Equipment Request")
    def patch(self, request, *args, **kwargs):
        equipment_request = self.get_object()

        equipment_request.status = "accepted"
        equipment_request.user_respo_owner = request.user

        comment = request.data.get("comment")
        if comment:
            equipment_request.comment = comment

        equipment_request.save()
        serializer = self.get_serializer(equipment_request)

        equipment = Equipment.objects.get(id=equipment_request.equipment_id)
        equipment.equipment_request = equipment_request
        equipment.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class EquipmentRequestRefuseView(generics.UpdateAPIView):
    queryset = EquipmentRequest.objects.all()
    serializer_class = EquipmentRequestSimpleSerializer

    @extend_schema(summary="Refuse an Equipment Request")
    def patch(self, request, *args, **kwargs):
        equipment_request = self.get_object()

        equipment_request.status = "refused"
        equipment_request.user_respo_owner = request.user

        comment = request.data.get("comment")
        if comment:
            equipment_request.comment = comment

        equipment_request.save()
        serializer = self.get_serializer(equipment_request)
        return Response(serializer.data, status=status.HTTP_200_OK)
