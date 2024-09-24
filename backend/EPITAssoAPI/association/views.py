from django.utils import timezone
from event.models import Event, EventMemberCommitment
from event.serializers import EventSerializer, EventMemberCommitmentsResumeForOneUser
from django.shortcuts import get_object_or_404
from django.db.models import Q
from drf_spectacular.utils import (
    extend_schema,
    OpenApiParameter,
    OpenApiResponse,
    OpenApiTypes,
    OpenApiExample,
)
from django.db.models import Count, Sum
from django.utils.dateparse import parse_datetime
from rest_framework import generics, status
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    AssociateUserAndAssociation,
    Association,
    Commitment,
    Faq,
    MemberCommitment,
    SocialNetwork,
)
from .serializers import (
    AssociationDetailsSerializer,
    AssociationListPaginationSerializer,
    AssociationSerializer,
    CommitmentSerializer,
    FaqSerializer,
    MemberCommitmentSerializer,
    MemberSerializer,
)
from user.permissions import IsMemberOfAssociation


class AssociationListView(generics.ListCreateAPIView):
    queryset = Association.objects.all()
    serializer_class = AssociationSerializer

    @extend_schema(summary="List all Associations")
    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(summary="Create an Association")
    def post(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


class AssociationListPaginationView(generics.ListAPIView):
    queryset = Association.objects.all()
    serializer_class = AssociationListPaginationSerializer
    pagination_class = LimitOffsetPagination

    @extend_schema(summary="List all Associations with pagination (limit, offset)")
    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class AssociationSlugView(generics.RetrieveAPIView):
    queryset = Association.objects.all()
    serializer_class = AssociationDetailsSerializer
    lookup_field = "slug"

    @extend_schema(summary="Retrieve an Association by slug")
    def get(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)


class AssociationEventsView(generics.ListAPIView):
    serializer_class = EventSerializer

    def get_queryset(self):
        slug = self.kwargs.get('slug')
        association = get_object_or_404(Association, slug=slug)
        return Event.objects.filter(association=association, start_date__gte=timezone.now()).order_by('start_date')

    @extend_schema(summary="Retrieve upcoming events for an Association by slug")
    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class AssociationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Association.objects.all()
    serializer_class = AssociationSerializer
    permission_classes = [IsMemberOfAssociation]

    @extend_schema(summary="Retrieve an Association")
    def get(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(summary="Update an Association")
    def put(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @extend_schema(summary="Delete an Association")
    def delete(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class AssociationDetailsView(generics.RetrieveUpdateAPIView):
    queryset = Association.objects.all()
    serializer_class = AssociationDetailsSerializer
    permission_classes = [IsMemberOfAssociation]

    @extend_schema(summary="Retrieve an Association with a depth of 1")
    def get(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(summary="Update an Association")
    def put(self, request, *args, **kwargs):
        new_faqs = request.data.get("faqs", [])
        self.__update_faqs(new_faqs, self.get_object())
        social_networks = request.data.get("social_networks", [])
        self.__update_social_networks(social_networks, self.get_object())
        return super().update(request, *args, **kwargs)

    def __update_faqs(self, faqs_data, instance):
        existing_faqs = list(instance.faqs.all())
        existing_faq_ids = [faq.id for faq in existing_faqs]

        for faq_data in faqs_data:
            if faq_data["id"] is None or faq_data["id"] == -1:
                faq_data.pop("id", None)
                Faq.objects.create(association=instance, **faq_data)
            elif faq_data["id"] in existing_faq_ids:
                faq = Faq.objects.get(id=faq_data["id"])
                for attr, value in faq_data.items():
                    setattr(faq, attr, value)
                faq.save()
                existing_faq_ids.remove(faq_data["id"])

        for faq_id in existing_faq_ids:
            Faq.objects.get(id=faq_id).delete()

    def __update_social_networks(self, social_networks_data, instance):
        existing_social_networks = list(instance.social_networks.all())
        existing_social_network_ids = [
            social_network.id for social_network in existing_social_networks
        ]

        for social_network_data in social_networks_data:
            if social_network_data["id"] is None or social_network_data["id"] == -1:
                social_network_data.pop("id", None)
                SocialNetwork.objects.create(
                    association=instance, **social_network_data
                )
            elif social_network_data["id"] in existing_social_network_ids:
                social_network = SocialNetwork.objects.get(id=social_network_data["id"])
                for attr, value in social_network_data.items():
                    setattr(social_network, attr, value)
                social_network.save()
                existing_social_network_ids.remove(social_network_data["id"])

        for social_network_id in existing_social_network_ids:
            SocialNetwork.objects.get(id=social_network_id).delete()


class FaqListView(generics.ListCreateAPIView):
    queryset = Faq.objects.all()
    serializer_class = FaqSerializer

    @extend_schema(summary="List all Faqs")
    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(summary="Create an Faq")
    def post(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


class FaqDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Faq.objects.all()
    serializer_class = FaqSerializer
    permission_classes = [IsMemberOfAssociation]

    @extend_schema(summary="Retrieve an Faq")
    def get(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(summary="Update an Faq")
    def put(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @extend_schema(summary="Delete an Faq")
    def delete(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class MemberListView(generics.ListAPIView):
    queryset = AssociateUserAndAssociation.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [IsMemberOfAssociation]

    def get_queryset(self):
        association_id = self.kwargs["pk"]
        return AssociateUserAndAssociation.objects.filter(association_id=association_id)

    @extend_schema(summary="List all Members")
    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class MemberDetailView(generics.RetrieveUpdateAPIView):
    queryset = AssociateUserAndAssociation.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [IsMemberOfAssociation]

    @extend_schema(summary="Retrieve a Member")
    def get(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(summary="Update a Member")
    def put(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)


class LargestAssociationView(generics.ListAPIView):
    queryset = Association.objects.all()
    serializer_class = AssociationSerializer

    def get_queryset(self):
        limit = self.request.query_params.get("limit", 6)
        try:
            limit = int(limit)
            if limit <= 0:
                limit = 6
        except ValueError:
            limit = 6
        return Association.objects.annotate(
            members_count=Count("associateuserandassociation")
        ).order_by("-members_count")[:limit]

    @extend_schema(summary="Retrieve 'limit' largest Association (default: 6)")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class AssociationGetBDEView(generics.ListAPIView):
    queryset = Association.objects.all()
    serializer_class = AssociationSerializer

    def get_queryset(self):
        return Association.objects.filter(type="BDE")

    @extend_schema(summary="List all Associations of type BDE")
    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class CommitmentListView(generics.ListCreateAPIView):
    queryset = Commitment.objects.all()
    serializer_class = CommitmentSerializer
    permission_classes = [IsMemberOfAssociation]

    def get_queryset(self):
        association_id = self.kwargs["pk"]
        return Commitment.objects.filter(association_id=association_id)

    @extend_schema(summary="List all Commitments")
    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(summary="Create a Commitment and all MemberCommitments needed")
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        association_id = self.kwargs["pk"]
        association = Association.objects.get(id=association_id)
        serializer.save(association=association)


class CommitmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Commitment.objects.all()
    serializer_class = CommitmentSerializer
    permission_classes = [IsMemberOfAssociation]

    def get_object(self):
        commitment_id = self.kwargs.get("commitment_id")
        return get_object_or_404(Commitment, id=commitment_id)

    @extend_schema(summary="Retrieve a Commitment")
    def get(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(summary="Update a Commitment")
    def put(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @extend_schema(summary="Delete a Commitment")
    def delete(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class ResumeAllCommitmentsView(APIView):
    permission_classes = [IsMemberOfAssociation]

    @extend_schema(
        summary="Retrieve all commitments and event commitments for an association",
        description="Get a summary of all commitments (Commitments) and event commitments (EventMemberCommitments) of an association's members. Optional filtering can be done using `start_date`, `end_date`, and `login` (min 3 characters).",
        parameters=[
            OpenApiParameter(
                "start_date",
                description="Start date for filtering commitments",
                required=False,
                type=OpenApiTypes.DATETIME,
            ),
            OpenApiParameter(
                "end_date",
                description="End date for filtering commitments",
                required=False,
                type=OpenApiTypes.DATETIME,
            ),
            OpenApiParameter(
                "login",
                description="Filter members by login",
                required=False,
                type=OpenApiTypes.STR,
            ),
        ],
        responses={
            200: OpenApiResponse(
                description="List of members with their commitment hours and event commitment hours",
                examples={
                    "application/json": [
                        {
                            "id": 1,
                            "login": "john_doe",
                            "first_name": "John",
                            "last_name": "Doe",
                            "commitment_hours": 10,
                            "event_commitment_hours": 5,
                            "total_hours": 15,
                        },
                        {
                            "id": 2,
                            "login": "jane_smith",
                            "first_name": "Jane",
                            "last_name": "Smith",
                            "commitment_hours": 8,
                            "event_commitment_hours": 7,
                            "total_hours": 15,
                        },
                    ]
                },
            ),
            400: OpenApiResponse(description="Bad request"),
            404: OpenApiResponse(description="Association not found"),
        },
    )
    def get(self, request, *args, **kwargs):
        association_id = kwargs["pk"]

        # Retrieve date parameters from request
        start_date_str = request.query_params.get("start_date")
        end_date_str = request.query_params.get("end_date")
        start_date = parse_datetime(start_date_str) if start_date_str else None
        end_date = parse_datetime(end_date_str) if end_date_str else None

        login_filter = request.query_params.get("login")

        try:
            association = Association.objects.get(id=association_id)
        except Association.DoesNotExist:
            return Response(
                {"error": "Association not found"}, status=status.HTTP_404_NOT_FOUND
            )

        members = AssociateUserAndAssociation.objects.filter(association=association)
        if login_filter:
            members = members.filter(user__username__icontains=login_filter)

        commitments = Commitment.objects.filter(association=association)
        if start_date and end_date:
            commitments = commitments.filter(
                ~Q(start_date__gt=end_date) & ~Q(end_date__lt=start_date)
            )

        events_commitments = EventMemberCommitment.objects.filter(member__in=members)
        if start_date and end_date:
            events_commitments = events_commitments.filter(
                event__start_date__gte=start_date, event__end_date__lte=end_date
            )
        elif start_date:
            events_commitments = events_commitments.filter(
                event__start_date__gte=start_date
            )
        elif end_date:
            events_commitments = events_commitments.filter(
                event__end_date__lte=end_date
            )

        member_hours = {
            member: {"commitment_hours": 0, "event_commitment_hours": 0}
            for member in members
        }

        for commitment in commitments:
            for member in members:
                member_hours[member]["commitment_hours"] += (
                    MemberCommitment.objects.filter(
                        commitment=commitment, member=member
                    ).aggregate(total_hours=Sum("hours"))["total_hours"]
                    or 0
                )

        for event_commitment in events_commitments:
            member_hours[event_commitment.member]["event_commitment_hours"] += (
                event_commitment.hours
            )

        response_data = []
        for member, hours in member_hours.items():
            response_data.append(
                {
                    "id": member.id,
                    "login": member.user.login,
                    "first_name": member.user.first_name,
                    "last_name": member.user.last_name,
                    "commitment_hours": hours["commitment_hours"],
                    "event_commitment_hours": hours["event_commitment_hours"],
                    "total_hours": hours["commitment_hours"]
                    + hours["event_commitment_hours"],
                }
            )

        return Response(response_data, status=status.HTTP_200_OK)


class ResumeEventsCommitmentsForOneMemberView(generics.ListAPIView):
    queryset = EventMemberCommitment.objects.all()
    serializer_class = EventMemberCommitmentsResumeForOneUser
    permission_classes = [IsMemberOfAssociation]

    def get_queryset(self):
        member_id = self.kwargs["member_id"]
        return EventMemberCommitment.objects.filter(member__id=member_id)

    @extend_schema(summary="List all EventMemberCommitments for one user")
    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class MemberCommitmentBulkUpdateView(generics.UpdateAPIView):
    queryset = MemberCommitment.objects.all()
    serializer_class = MemberCommitmentSerializer
    # permission_classes = [IsMemberOfAssociation]

    @extend_schema(
        summary="Bulk update MemberCommitments",
        description=(
            "This endpoint allows bulk updating of multiple MemberCommitments. "
            "Each commitment must be identified by its ID, and the `hours` field can be updated. "
            "The request body should be a list of objects, each containing an `id` and any fields to be updated."
        ),
        request={
            "application/json": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "integer",
                            "example": 1,
                            "description": "The ID of the MemberCommitment to update",
                        },
                        "hours": {
                            "type": "integer",
                            "example": 5,
                            "description": "Number of hours committed",
                        },
                    },
                    "required": ["id"],
                },
            }
        },
        responses={
            status.HTTP_200_OK: OpenApiExample(
                "Success",
                summary="Successful update",
                value=[
                    {"id": 1, "member": 1, "hours": 5},
                    {"id": 2, "member": 2, "hours": 3},
                ],
            ),
            status.HTTP_400_BAD_REQUEST: OpenApiExample(
                "Invalid request",
                summary="Invalid request data",
                value={"error": "Request data should be a list of commitments"},
            ),
            status.HTTP_404_NOT_FOUND: OpenApiExample(
                "Commitment not found",
                summary="Commitment not found",
                value={"error": "MemberCommitment with ID 5 not found"},
            ),
        },
    )
    def patch(self, request, *args, **kwargs):
        commitments_data = request.data

        if not isinstance(commitments_data, list):
            return Response(
                {"error": "Request data should be a list of commitments"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        updated_commitments = []

        for commitment_data in commitments_data:
            try:
                commitment_instance = MemberCommitment.objects.get(
                    id=commitment_data["id"]
                )
            except MemberCommitment.DoesNotExist:
                return Response(
                    {
                        "error": f"MemberCommitment with ID {commitment_data['id']} not found"
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )

            serializer = self.get_serializer(
                commitment_instance, data=commitment_data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                updated_commitments.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(updated_commitments, status=status.HTTP_200_OK)
