from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.UserList.as_view()),
    path('users/<int:user_id>/', views.UserDetail.as_view()),
    path('users/<int:user_id>/followers/', views.UserFollowersList.as_view()),
    path('users/<int:user_id>/following/', views.UserFollowersList.as_view())
]