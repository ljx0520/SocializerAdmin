from django.contrib.auth import get_user_model
from rest_framework import mixins, viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from permissions import IsSuperuser
from superusers.v1.serializers import UserDetailSerializer, UserCreateSerializer, UserUpdateSerializer

User = get_user_model()


class SuperuserViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet):
    """
    user
    """
    queryset = User.objects.all()
    filter_backends = [filters.SearchFilter, ]
    search_fields = ['username', 'first_name', 'last_name', 'email']

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action == 'update' or self.action == 'partial_update':
            return UserUpdateSerializer
        return UserDetailSerializer

    def get_permissions(self):
        return [IsAuthenticated(), IsSuperuser()]

    def get_queryset(self):
        return self.queryset

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.id == self.request.user.id:
            # cannot delete yourself
            return Response('You cannot delete yourself', status=status.HTTP_401_UNAUTHORIZED)
        elif instance.is_superuser:
            # cannot delete a superuser
            return Response('You cannot delete a superuser', status=status.HTTP_401_UNAUTHORIZED)
        else:
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()
