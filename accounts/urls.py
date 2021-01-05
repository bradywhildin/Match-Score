from django.urls import path
from . import views

urlpatterns = [
    path('get-users', views.GetUserList.as_view()),
    path('create-profile', views.ProfileCreate.as_view()),
    path('update-profile', views.ProfileUpdate.as_view()),
    path('create-user', views.UserCreate.as_view()),
    path('check-user-profile', views.CheckUserProfile.as_view()),
    path('get-coordinates', views.ZipToCoord.as_view()),
    path('get-user-id', views.getUserId.as_view()),
]