from django.urls import path
from . import views

urlpatterns = [
  path('make-match-request', views.makeMatchRequest.as_view())
]