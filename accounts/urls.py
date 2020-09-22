from django.urls import path
from . import views

urlpatterns = [
    path('get-users', views.GetUserList.as_view()),
    path('create-profile', views.ProfileCreate.as_view()),
    path('update-profile', views.ProfileUpdate.as_view()),
    path('create-user', views.UserCreate.as_view()),
    path('check-user-profile', views.CheckUserProfile.as_view()),
    path('logout', views.Logout.as_view())
]