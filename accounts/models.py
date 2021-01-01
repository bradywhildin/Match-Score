from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='Images/', default='Images/None/No-img.jpg')
    bio = models.TextField(max_length=500, blank=True)
    zip = models.CharField(max_length=5, blank=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    a1 = models.IntegerField(blank=True)
    a2 = models.IntegerField(blank=True)
    a3 = models.IntegerField(blank=True)
    a4 = models.IntegerField(blank=True)
    a5 = models.IntegerField(blank=True)
