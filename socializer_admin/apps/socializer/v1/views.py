from django.contrib.auth import get_user_model
from rest_framework import mixins, viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from socializer.filters import DisputesFilter
from socializer.models import Disputes
from socializer.v1.serializers import DisputesSerializer, DisputeSerializer

User = get_user_model()


class DisputesViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet):
    """
    Disputes
    """
    queryset = Disputes.objects.all().filter(deleted_at=0).order_by('created_at')
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter,)
    filterset_class = DisputesFilter
    ordering_fields = ['created_at', 'dispute_processed_at']

    lookup_field = "id"

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return DisputeSerializer
        return DisputesSerializer
