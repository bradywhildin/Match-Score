from django.shortcuts import render
from .models import Message
from rest_framework.views import APIView
from matches.models import Match
from rest_framework.response import Response

class getMessages(APIView):
    def get(self, request):
        match = Match.objects.get(id=request.query_params['match_id'])

        messages = Message.objects.filter(match=match)

        response = []
        for message in messages:
            response.append({
                'author': {
                    'name': message.author.first_name,
                    'id': message.author.id,
                },
                'content': message.content,
                'id': message.id,
                'time': message.time,
            })

        return Response(response)
    


