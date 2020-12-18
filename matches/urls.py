from django.urls import path
from . import views

urlpatterns = [
  path('make-match-request', views.makeMatchRequest.as_view()),
  path('get-matches', views.getMatches.as_view()),
  path('block', views.block.as_view()),
]