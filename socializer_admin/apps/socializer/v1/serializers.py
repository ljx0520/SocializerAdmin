import uuid
from datetime import datetime, timezone

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from socializer.models import Disputes, UserProfiles, Activities, Offers, Orders

User = get_user_model()


class DisputesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disputes
        fields = "__all__"


class DisputeSerializer(serializers.ModelSerializer):
    object = serializers.SerializerMethodField()
    user_profile = serializers.SerializerMethodField()

    def get_user_profile(self, obj):
        try:
            user_profile = UserProfiles.objects.get(user_id=obj.user_id)
            serializer = UserProfileSerializer(user_profile, many=False,
                                               context={'request': self.context['request']})
            return serializer.data
        except Exception as e:
            # cannot find
            return None

    def get_object(self, obj):
        if obj.dispute_object == "UserProfile":
            try:
                user_profile = UserProfiles.objects.get(user_id=obj.object_id)
                serializer = UserProfileSerializer(user_profile, many=False,
                                                   context={'request': self.context['request']})
                return serializer.data
            except Exception as e:
                # cannot find
                return None
        elif obj.dispute_object == "Activity":
            try:
                activity = Activities.objects.get(id=obj.object_id)
                serializer = ActivitySerializer(activity, many=False,
                                                context={'request': self.context['request']})
                return serializer.data
            except Exception as e:
                # cannot find
                return None
        elif obj.dispute_object == "Offer":
            try:
                offer = Offers.objects.get(id=obj.object_id)
                serializer = OfferSerializer(offer, many=False,
                                             context={'request': self.context['request']})
                return serializer.data
            except Exception as e:
                # cannot find
                return None
        elif obj.dispute_object == "Order":
            try:
                order = Orders.objects.get(id=obj.object_id)
                serializer = OrderSerializer(order, many=False,
                                             context={'request': self.context['request']})
                return serializer.data
            except Exception as e:
                # cannot find
                return None
        return None

    class Meta:
        model = Disputes
        fields = "__all__"


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfiles
        fields = "__all__"


class ActivitySerializer(serializers.ModelSerializer):
    userprofile = serializers.SerializerMethodField()

    def get_userprofile(self, obj):
        try:
            user_profile = UserProfiles.objects.get(user_id=obj.user_id)
            serializer = UserProfileSerializer(user_profile, many=False,
                                               context={'request': self.context['request']})
            return serializer.data
        except Exception as e:
            # cannot find
            return None

    class Meta:
        model = Activities
        fields = "__all__"


class OfferSerializer(serializers.ModelSerializer):
    payee = serializers.SerializerMethodField()
    payer = serializers.SerializerMethodField()

    def get_payee(self, obj):
        try:
            user_profile = UserProfiles.objects.get(user_id=obj.payee_id)
            serializer = UserProfileSerializer(user_profile, many=False,
                                               context={'request': self.context['request']})
            return serializer.data
        except Exception as e:
            # cannot find
            return None

    def get_payer(self, obj):
        try:
            user_profile = UserProfiles.objects.get(user_id=obj.payer_id)
            serializer = UserProfileSerializer(user_profile, many=False,
                                               context={'request': self.context['request']})
            return serializer.data
        except Exception as e:
            # cannot find
            return None

    class Meta:
        model = Offers
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    payee = serializers.SerializerMethodField()
    payer = serializers.SerializerMethodField()

    def get_payee(self, obj):
        try:
            user_profile = UserProfiles.objects.get(user_id=obj.payee_id)
            serializer = UserProfileSerializer(user_profile, many=False,
                                               context={'request': self.context['request']})
            return serializer.data
        except Exception as e:
            # cannot find
            return None

    def get_payer(self, obj):
        try:
            user_profile = UserProfiles.objects.get(user_id=obj.payer_id)
            serializer = UserProfileSerializer(user_profile, many=False,
                                               context={'request': self.context['request']})
            return serializer.data
        except Exception as e:
            # cannot find
            return None

    class Meta:
        model = Orders
        fields = "__all__"


class DisputeUpdateSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )
    dispute_status = serializers.ChoiceField(required=True,
                                             choices=(('Processing', 'Processing'), ('Resolved', 'Resolved'),
                                                      ('Submitted', 'Submitted')))
    dispute_result = serializers.CharField(required=False, allow_blank=True)
    dispute_notes = serializers.CharField(required=False, allow_blank=True)
    dispute_resolved_at = serializers.DateTimeField(required=False, )
    dispute_resolved_by = serializers.CharField(required=False, allow_blank=True)
    notes = serializers.JSONField(read_only=True)
    note = serializers.CharField(write_only=True, required=False, allow_blank=True)
    dispute_processed_at = serializers.DateTimeField(required=False, )
    dispute_processed_by = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        dispute_status = attrs.get('dispute_status')
        user = attrs.get('user')

        if self.instance.dispute_status == "Processing":
            if dispute_status not in ['Processing', 'Resolved']:
                return serializers.ValidationError("Invalid Dispute Status")
        elif self.instance.dispute_status == "Resolved":
            if dispute_status not in ['Resolved']:
                return serializers.ValidationError("Invalid Dispute Status")

        if self.instance.dispute_status == "Submitted" and dispute_status == "Processing":
            attrs['dispute_processed_at'] = datetime.now(timezone.utc)
            attrs['dispute_processed_by'] = user.id
        if self.instance.dispute_status == "Processing" and dispute_status == "Resolved":
            attrs['dispute_resolved_at'] = datetime.now(timezone.utc)
            attrs['dispute_resolved_by'] = user.id
        if self.instance.dispute_status == "Submitted" and dispute_status == "Resolved":
            curr = datetime.now(timezone.utc)
            attrs['dispute_processed_at'] = curr
            attrs['dispute_processed_by'] = user.id
            attrs['dispute_resolved_at'] = curr
            attrs['dispute_resolved_by'] = user.id

        note = attrs.get('note')
        if note:
            notes = self.instance.notes
            new_note = {"note": note,
                        "sent_at": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S"),
                        "user_id": str(uuid.UUID(int=0)),
                        "nickname": "", "host_or_guest": "Host"}
            notes.append(new_note)
            attrs['notes'] = notes
        return attrs

    class Meta:
        model = Disputes
        fields = (
            "user",
            "dispute_status", "dispute_result", "dispute_notes", "dispute_resolved_at", "dispute_resolved_by", "notes",
            "note",
            "dispute_processed_at", "dispute_processed_by")
