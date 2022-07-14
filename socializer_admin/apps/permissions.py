from rest_framework import permissions


class IsOwnerOrReadOnlyUserModel(permissions.BasePermission):
    """
    model operation for owner only
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj == request.user


class IsSuperuser(permissions.BasePermission):
    """
    only for superuser
    """

    def has_object_permission(self, request, view, obj):
        return request.user.is_superuser
