from django.contrib.auth.models import User
from .models import Profile
from .serializers import UserSerializer, ProfileSerializer
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
from rest_framework.parsers import MultiPartParser
from rest_framework.exceptions import APIException

class UserCreate(generics.CreateAPIView):
    permission_classes = [AllowAny,]
    serializer_class = UserSerializer

class ProfileCreate(generics.CreateAPIView):
    permission_classes = [IsAuthenticated,]
    serializer_class = ProfileSerializer
    parser_classes = (MultiPartParser,)

    def perform_create(self, serializer):        
        serializer.save(user=self.request.user)

class GetUserList(APIView):
    def get(self, request):
        currentUser = request.user
        profile = currentUser.profile
        currentUserAnswers = [profile.a1, profile.a2, profile.a3, profile.a4, profile.a5]
        currentUserCoord = (profile.latitude, profile.longitude)

        users = User.objects.all().exclude(id=currentUser.id)
        response = []
        for user in users:
            if hasattr(user, 'profile'): # make sure user has a profile
                matchScore = 20
                profile = user.profile
                userAnswers = [profile.a1, profile.a2, profile.a3, profile.a4, profile.a5]

                # find differences in answers between user and logged in user
                for i in range(len(userAnswers)):
                    diff = abs(currentUserAnswers[i] - userAnswers[i])
                    matchScore -= diff

                # find distance between zip codes
                userCoord = (profile.latitude, profile.longitude)
                distance = geodesic(currentUserCoord, userCoord).miles

                totalScore = matchScore - (distance/5) # factor in distance and match score to get total score

                distanceShown = str(round(distance + 5))
                response.append({
                    'bio': profile.bio,
                    'distance': distanceShown,
                    'first_name': user.first_name,
                    'id': user.id,
                    'match_score': matchScore,
                    'image': profile.image.url,
                    'total_score': totalScore,
                })

        response.sort(key=getTotalScore, reverse=True) # sort users from best to worst total score

        return Response(response)

def getTotalScore(json):
    return json['total_score']

class CheckUserProfile(APIView):
    def get(self, request):
        user = request.user
        if hasattr(user, 'profile'):
            response = { 
                'has_profile': 1,
                'profile': {
                    'a1': user.profile.a1,
                    'a2': user.profile.a2,
                    'a3': user.profile.a3,
                    'a4': user.profile.a4,
                    'a5': user.profile.a5,
                    'bio': user.profile.bio,
                    'image': user.profile.image.url,
                    'zip': user.profile.zip,
                }
            }
        else:
            response = { 
                'has_profile': 0 
            }
        return Response(response)

class ProfileUpdate(APIView):
    def put(self, request):
        try:
            profile = request.user.profile
            profile.image = request.data['image']
            profile.bio = request.data['bio']
            profile.zip = request.data['zip']
            profile.latitude = request.data['latitude']
            profile.longitude = request.data['longitude']
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

        except:
            raise APIException('Profile update failed.')

class ZipToCoord(APIView):
    permission_classes = [AllowAny,]
    def get(self, request):
        geolocator = Nominatim(user_agent='views.py')
        zip = request.query_params['zip']
        location = geolocator.geocode(zip + ', United States')
        response = {
            'latitude': location.latitude,
            'longitude': location.longitude,
        }
        return Response(response)