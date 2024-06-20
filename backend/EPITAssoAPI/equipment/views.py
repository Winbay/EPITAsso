from drf_spectacular.utils import extend_schema
from rest_framework import generics, serializers, status
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from association.models import Association
from .models import Equipment, EquipmentRequest
from .serializers import (
    EquipmentRequestSimpleSerializer,
    EquipmentSerializer,
    EquipmentRequestSerializer,
)


class EquipmentListView(generics.ListCreateAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer

    @extend_schema(summary="List all Equipments")
    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(summary="Create an Equipment")
    def post(self, request, *args, **kwargs):
        request.data["asso_owner"] = kwargs.get("association_id")
        request.data["equipment_request"] = None
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                asso_owner=self.__get_association_owner(),
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def __get_association_owner(self):
        association_id = self.kwargs.get("association_id")
        try:
            association = Association.objects.get(id=association_id)
        except Association.DoesNotExist:
            raise serializers.ValidationError("Invalid association ID")
        return association


class EquipmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer


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
            association_borrower = self.__get_association_borrower()

            equipment_request = serializer.save(
                user_respo_borrower=request.user,
                asso_borrower=association_borrower,
                user_respo_owner=None,
            )
            print("equipment_request", equipment_request)

            # TODO improve this
            Equipment.objects.filter(id=equipment_id).update(
                equipment_request=equipment_request
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def __get_association_borrower(self):
        association_id = self.kwargs.get("association_id")
        try:
            association = Association.objects.get(id=association_id)
        except Association.DoesNotExist:
            raise serializers.ValidationError("Invalid association ID")
        return association

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


class EquipmentRequestReceivedView(generics.ListAPIView):
    serializer_class = EquipmentRequestSerializer

    def get_queryset(self):
        association_id = self.kwargs.get("association_id")
        return EquipmentRequest.objects.filter(equipment__asso_owner_id=association_id)


class EquipmentRequestSentView(generics.ListAPIView):
    serializer_class = EquipmentRequestSerializer

    def get_queryset(self):
        return EquipmentRequest.objects.filter(
            asso_borrower=self.kwargs.get("association_id")
        )


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
