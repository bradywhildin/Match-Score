from django.shortcuts import render
from rest_framework.views import APIView
from .models import MatchRequest, Match
from django.contrib.auth.models import User
from rest_framework.response import Response

class makeMatchRequest(APIView):
    def post(self, request):
        sender = request.user
        reciever = User.objects.get(id=request.data['reciever_id'])

        # see if reciever already sent a request to sender, if so make match
        oppositeMR = MatchRequest.objects.filter(sender=reciever, reciever=sender)
        if oppositeMR.exists():
            match = Match(user1=reciever, user2=sender)
            match.save()
            oppositeMR.delete() # remove now useless match request from db
            response = {
                'detail': 'Match made between ' + sender.username + ' and ' + reciever.username
            }

        else:
            mr = MatchRequest(sender=sender, reciever=reciever)
            mr.save()
            response = {
                'detail': 'Match request sent from ' + sender.username + ' to ' + reciever.username,
            }

        return Response(response)
