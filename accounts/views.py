from django.contrib.auth.models import User
from .models import Profile
from .serializers import UserSerializer, ProfileSerializer
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

class UserCreate(generics.CreateAPIView):
    permission_classes = [AllowAny,]
    serializer_class = UserSerializer

class ProfileCreate(generics.CreateAPIView):
    permission_classes = [IsAuthenticated,]
    serializer_class = ProfileSerializer

    def perform_create(self, serializer):        
        serializer.save(user=self.request.user)

class GetUserList(APIView):
    def get(self, request):
        users = User.objects.all()
        response = []
        for user in users:
            if user != request.user and hasattr(user, 'profile'): # make sure users shown aren't current user or a user without profile settings
                response.append({
                    'bio': user.profile.bio,
                    'first_name': user.first_name,
                    'id': user.id,
                    'last_name': user.last_name,
                    'username': user.username,
                })
        return Response(response)

class CheckUserProfile(APIView):
    def get(self, request):
        user = request.user
        if hasattr(user, 'profile'):
            response = { 
                'has_profile': 1,
                'profile': {
                    'bio': user.profile.bio,
                    'zip': user.profile.zip,
                    'a1': user.profile.a1,
                    'a2': user.profile.a2,
                    'a3': user.profile.a3,
                    'a4': user.profile.a4,
                    'a5': user.profile.a5,
                }
            }
        else:
            response = { 
                'has_profile': 0 
            }
        return Response(response)

class ProfileUpdate(APIView):
    def put(self, request):
        profile = request.user.profile
        profile.zip = request.data['zip']
        profile.bio = request.data['bio']
        profile.a1 = request.data['a1']
        profile.a2 = request.data['a2']
        profile.a3 = request.data['a3']
        profile.a4 = request.data['a4']
        profile.a5 = request.data['a5']
        profile.save()
        response = {
            'detail': 'Profile saved.'
        }
        return Response(response)