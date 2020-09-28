from django.shortcuts import render
from rest_framework.views import APIView
from .models import MatchRequest
from django.contrib.auth.models import User
from rest_framework.response import Response

class makeMatchRequest(APIView):
    def post(self, request):
        sender = request.user
        reciever = User.objects.get(id=request.data['reciever_id'])
        mr = MatchRequest(sender=sender, reciever=reciever)
        mr.save()
        
        response = {
            'detail': 'Match request sent from ' + sender.username + ' to ' + reciever.username,
        }
        return Response(response)
