from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

User = get_user_model()


class UserDetailSerializer(serializers.ModelSerializer):
    """
    User detail serializer
    """

    class Meta:
        model = User
        fields = ("id", "last_login", "is_superuser", "username", "first_name", "last_name", "email", "is_staff",
                  "is_active", "date_joined")


class UserCreateSerializer(serializers.ModelSerializer):
    """
    User create serializer
    """

    username = serializers.CharField(max_length=100, required=True,
                                     validators=[UniqueValidator(queryset=User.objects.all())])
    email = serializers.CharField(max_length=100, required=True)
    password = serializers.CharField(write_only=True,
                                     max_length=100, required=True)
    first_name = serializers.CharField(max_length=100, required=True)
    last_name = serializers.CharField(max_length=100, required=True)
    is_superuser = serializers.BooleanField(default=False)
    is_staff = serializers.BooleanField(default=True)
    is_active = serializers.BooleanField(default=True)

    class Meta:
        model = User
        fields = ("id", "is_superuser", "password", "username", "first_name", "last_name", "email", "is_staff",
                  "is_active", "date_joined")

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get('password'))
        return super(UserCreateSerializer, self).create(validated_data)


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    User update serializer
    """

    username = serializers.CharField(read_only=True)
    email = serializers.CharField(max_length=100, required=True)
    password = serializers.CharField(write_only=True,
                                     max_length=100, required=True)
    first_name = serializers.CharField(max_length=100, required=True)
    last_name = serializers.CharField(max_length=100, required=True)
    is_superuser = serializers.BooleanField(default=False)
    is_staff = serializers.BooleanField(default=True)
    is_active = serializers.BooleanField(default=True)

    class Meta:
        model = User
        fields = ("id", "is_superuser", "password", "username", "first_name", "last_name", "email", "is_staff",
                  "is_active", "date_joined")

    def update(self, instance, validated_data):
        validated_data['password'] = make_password(validated_data.get('password'))
        return super(UserUpdateSerializer, self).update(instance, validated_data)
