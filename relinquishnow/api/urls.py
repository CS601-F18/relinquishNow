from django.urls import path

from api.views import *


urlpatterns = [
    path('users/', UserList.as_view()),
    path('users/<int:userId>/', UserDetail.as_view()),
    path('users/<int:userId>/itemsPosted/', UserDetail.as_view()),
    path('users/<int:userId>/itemsRequested/', UserDetail.as_view()),
    
    
    path('items/', UserList.as_view()),
    path('items/<int:itemId>/', UserDetail.as_view()),
    path('items/<int:itemId>/requests/', UserDetail.as_view()),
    
    
    path('posts/', UserList.as_view()),
    path('posts/<int:postId>/', UserDetail.as_view()),
    
    path('helpcenters/', HelpCenterList.as_view()),
    path('helpcenters/<int:hcId>/', HelpCenterDetail.as_view()),
    path('helpcenters/<int:hcId>/members/', UserDetail.as_view()),
    
    path('messages/', UserDetail.as_view()),
    path('messages/<int:messageId>/', UserDetail.as_view()),
    
#     path('users/<int:userId>/images/', UserDetail.as_view()),
#     path('users/<int:userId>/posts/', UserDetail.as_view()),
#     path('users/<int:userId>/helpcenters/', UserDetail.as_view()),
#     path('users/<int:userId>/followers/', UserFollowersList.as_view()),
#     path('users/<int:userId>/following/', UserFollowersList.as_view()),
#     path('users/<int:userId>/notifications/', UserDetail.as_view()),
#     path('users/<int:userId>/messages/', UserDetail.as_view()),
]