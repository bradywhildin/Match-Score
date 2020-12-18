from django.shortcuts import render
from rest_framework.views import APIView
from .models import MatchRequest, Match, Block
from django.contrib.auth.models import User
from rest_framework.response import Response
from accounts.views import getMatchData

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

class getMatches(APIView):
    def get(self, request):
        currentUser = request.user
        profile = currentUser.profile
        currentUserAnswers = [profile.a1, profile.a2, profile.a3, profile.a4, profile.a5]
        currentUserCoord = (profile.latitude, profile.longitude)

        matches = Match.objects.filter(user1=currentUser) | Match.objects.filter(user2=currentUser)
        response = []
        for match in matches:
            if currentUser == match.user1:
                user = match.user2
            else:
                user = match.user1
            response.append(getMatchData(user, currentUserAnswers, currentUserCoord))

        return Response(response)

class block(APIView):
    def post(self, request):
        blocker = request.user
        blockee = User.objects.get(id=request.data['blockee_id'])

        block = Block(blocker=blocker, blockee=blockee)
        block.save()

        response = {
            'detail': blocker.username + ' successfully blocked ' + blockee.username,
        }

        return Response(response)

        
