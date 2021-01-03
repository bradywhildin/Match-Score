from django.urls import path
from . import views

urlpatterns = [
  path('get-messages', views.getMessages.as_view()),
  path('add-message', views.addMessage.as_view()),
]