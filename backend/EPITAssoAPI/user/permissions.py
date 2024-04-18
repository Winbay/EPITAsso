from rest_framework import permissions

class IsCustomAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_custom_admin