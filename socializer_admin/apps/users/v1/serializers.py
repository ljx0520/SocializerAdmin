from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserDetailSerializer(serializers.ModelSerializer):
    """
    User detail serializer
    """

    class Meta:
        model = User
        fields = ("id", "last_login", "is_superuser", "username", "first_name", "last_name", "email", "is_staff",
                  "is_active", "date_joined")


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    User update serializer
    """
    first_name = serializers.CharField(max_length=100, required=True)
    last_name = serializers.CharField(max_length=100, required=True)

    class Meta:
        model = User
        fields = ("first_name", "last_name")
