from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True)
    # location = models.CharField(max_length=30, blank=True)
    # a1 = models.IntegerField(blank=True)
    # a2 = models.IntegerField(blank=True)
    # a3 = models.IntegerField(blank=True)
    # a4 = models.IntegerField(blank=True)
    # a5 = models.IntegerField(blank=True)
