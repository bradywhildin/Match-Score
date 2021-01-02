from django.urls import path
from . import views

urlpatterns = [
  path('get-messages', views.getMessages.as_view()),
]