import uuid

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
