from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.transaction import atomic
from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from permissions import IsOwnerOrReadOnlyUserModel
from users.v1.serializers import UserDetailSerializer, UserUpdateSerializer

User = get_user_model()


class UserViewSet(
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet):
    """
    user
    """
    queryset = User.objects.all()

    def get_serializer_class(self):
        if self.action == 'update' or self.action == 'partial_update':
            return UserUpdateSerializer
        return UserDetailSerializer

    def get_permissions(self):
        if self.action == 'retrieve':
            return [IsAuthenticated()]
        elif self.action == 'update':
            return [IsAuthenticated(), IsOwnerOrReadOnlyUserModel(), ]
        return []

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        return Response(serializer.data)
