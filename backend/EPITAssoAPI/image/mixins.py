from rest_framework.response import Response
from rest_framework import status


class AssociationPermissionMixin:
    def check_association(self, request):
        image = self.get_object()
        association = request.association
        if image.association != association:
            return Response(
                {"detail": "You do not have permission to perform this action."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return None
