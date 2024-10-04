from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import UserRole

class IsSuperAdmin(BasePermission):
    """
    Permission to only allow super admin.
    """
    message = 'Must be a super admin.'
    code = 403

    def has_permission(self, request, view):
        return request.user.role == UserRole.SUPER_ADMIN