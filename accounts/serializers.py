from django.contrib.auth.models import User
from .models import Profile
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'username', 'password')
        write_only_fields = ('password')

    def create(self, validated_data):
        user = User(username=validated_data['username'], first_name=validated_data['first_name'], last_name=validated_data['last_name'])
        user.set_password(validated_data['password'])
        user.save()
        return user

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('bio', 'zip', 'a1', 'a2', 'a3', 'a4', 'a5',)
