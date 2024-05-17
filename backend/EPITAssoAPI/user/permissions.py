from rest_framework import permissions


class IsCustomAdmin(permissions.BasePermission):
    message = "You must be an admin of EPIT'Asso to perform this action."

    def has_permission(self, request, view):
        return request.user and request.user.is_custom_admin


class IsMemberOfAssociation(permissions.BasePermission):
    message = "You must be a member of this association to perform this action."

    def has_object_permission(self, request, view, obj):
        return request.user in obj.members.all()
