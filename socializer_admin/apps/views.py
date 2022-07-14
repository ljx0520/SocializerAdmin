from rest_framework import exceptions
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.serializers import PingPongSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q

User = get_user_model()


class PingPongView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        serializer = PingPongSerializer(data=request.GET)
        if serializer.is_valid():
            if serializer.data['ping'] == 'ping':
                return Response({'msg': 'pong'})
            else:
                return Response({'msg': "What's in your head?"})
        else:
            return Response({'error': serializer.errors})
