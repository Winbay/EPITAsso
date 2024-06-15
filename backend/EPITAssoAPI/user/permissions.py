from rest_framework import permissions
from association.models import AssociateUserAndAssociation


class IsCustomAdmin(permissions.BasePermission):
    message = "You must be an admin of EPIT'Asso to perform this action."

    def has_permission(self, request, view):
        return request.user and request.user.is_custom_admin


class IsMemberOfAssociation(permissions.BasePermission):
    message = "You must be a member of this association to perform this action."

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        association_id = view.kwargs.get('pk')
        return AssociateUserAndAssociation.objects.filter(
            association_id=association_id,
            user=request.user
        ).exists()
