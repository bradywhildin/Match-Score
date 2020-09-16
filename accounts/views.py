from django.contrib.auth.models import User
from .serializers import UserSerializer
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response

class UserListCreate(generics.ListCreateAPIView):
    permission_classes = [AllowAny,]

    queryset = User.objects.all()
    serializer_class = UserSerializer

    def list(self, request):
        queryset = self.get_queryset().exclude(id=request.user.id)
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)
