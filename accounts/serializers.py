from django.contrib.auth.models import User
from .models import Profile
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'username', 'password')
        write_only_fields = ('password')

    def create(self, validated_data):
        user = User(username=validated_data['username'], first_name=validated_data['first_name'])
        user.set_password(validated_data['password'])
        user.save()
        return user

class ProfileSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(max_length=None, use_url=True)

    class Meta:
        model = Profile
        fields = ('image', 'bio', 'zip', 'latitude', 'longitude', 'a1', 'a2', 'a3', 'a4', 'a5',)