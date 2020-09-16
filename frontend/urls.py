from django.urls import re_path, path
from . import views

urlpatterns = [
    path('login', views.index),
    path('home', views.index),
    path('createAccount', views.index)
]