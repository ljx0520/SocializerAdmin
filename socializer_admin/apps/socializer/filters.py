from django_filters import rest_framework as filters

from socializer.models import Disputes


class DisputesFilter(filters.FilterSet):
    """
    Dispute Filter
    """
    dispute_object = filters.CharFilter(method='dispute_object_filter', label='dispute_object')
    dispute_type = filters.CharFilter(method='dispute_type_filter', label='dispute_type')
    dispute_status = filters.CharFilter(method='dispute_status_filter', label='dispute_status')

    def dispute_object_filter(self, queryset, name, value):
        return queryset.filter(dispute_object=value)

    def dispute_type_filter(self, queryset, name, value):
        return queryset.filter(dispute_type=value)

    def dispute_status_filter(self, queryset, name, value):
        return queryset.filter(dispute_status=value)

    class Meta:
        model = Disputes
        fields = ['dispute_object', 'dispute_type', 'dispute_status']
