from django.contrib.auth.models import User
from .serializers import UserSerializer
from rest_framework import generics
from rest_framework.permissions import AllowAny

class UserListCreate(generics.ListCreateAPIView):
    permission_classes = [AllowAny,]

    queryset = User.objects.all()
    serializer_class = UserSerializer

