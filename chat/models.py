from django.db import models
from matches.models import Match
from django.contrib.auth.models import User

class Message(models.Model):
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='match')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='author')
    content = models.TextField()
    time = models.DateTimeField(auto_now_add=True)