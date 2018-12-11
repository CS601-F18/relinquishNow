import json

from django.http.response import Http404

from api.models import User, HelpCenter, UserFollower, Item, ItemRequests
from api.serializers import UserSerializer, HelpCenterSerializer, ItemSerializer, \
    ItemRequestSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class UserList(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        data = json.loads(request.query_params.get('data', {}))
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save(password=data.get("user_password"))
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetail(APIView):
    def get_object(self, userId):
        try:
            return User.objects.get(user_id=userId)
        except User.DoesNotExist:
            raise Http404

    def get(self, request, userId):
        user = self.get_object(userId)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, userId):
        user = self.get_object(userId)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
 
class UserFollowersList(APIView):
    def get(self, request, userId):
        user_followers_list = UserFollower.objects.filter(user_id=userId).values_list('follower_user_id', flat=True)
        user_followers = User.objects.filter(user_id__in=user_followers_list)
        serializer = UserSerializer(user_followers, many=True)
        return Response(serializer.data)
    

class UserFollowingList(APIView):
    def get(self, request, userId):
        user_following_list = UserFollower.objects.filter(follower_user_id=userId).values_list('user_id', flat=True)
        user_following = User.objects.filter(user_id__in=user_following_list)
        serializer = UserSerializer(user_following, many=True)
        return Response(serializer.data)
    
 
class HelpCenterList(APIView):
    def get(self, request):
        helpCenters = HelpCenter.objects.all()
        serializer = HelpCenterSerializer(helpCenters, many=True)
        return Response(serializer.data)
    
    
    def post(self, request):
        helpCenter = json.loads(request.query_params.get('data', {}))
        serializer = HelpCenterSerializer(data=helpCenter)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   


class HelpCenterDetail(APIView):
    def get_object(self, hcId):
        try:
            return HelpCenter.objects.get(hc_id=hcId)
        except HelpCenter.DoesNotExist:
            raise Http404

    def get(self, request, hcId):
        helpCenter = self.get_object(hcId)
        serializer = HelpCenterSerializer(helpCenter)
        return Response(serializer.data)

    def put(self, request, hcId):
        helpCenter = self.get_object(hcId)
        serializer = HelpCenterSerializer(helpCenter, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class ItemsList(APIView):
    def get(self, request):
        helpCenters = Item.objects.all()
        serializer = ItemSerializer(helpCenters, many=True)
        return Response(serializer.data)
    
    
    def post(self, request):
        helpCenter = json.loads(request.query_params.get('data', {}))
        serializer = ItemSerializer(data=helpCenter)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   


class ItemDetail(APIView):
    def get_object(self, itemId):
        try:
            return Item.objects.get(item_id=itemId)
        except HelpCenter.DoesNotExist:
            raise Http404

    def get(self, request, itemId):
        item = self.get_object(itemId)
        serializer = ItemSerializer(item)
        return Response(serializer.data)

    def put(self, request, itemId):
        item = self.get_object(itemId)
        serializer = ItemSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ItemRequestList(APIView):
    def get(self, request, itemId):
        itemRequests = ItemRequests.objects.filter(item_id=itemId)
        serializer = ItemRequestSerializer(itemRequests, many=True)
        return Response(serializer.data)
    
    
    def post(self, request):
        itemRequest = json.loads(request.query_params.get('data', {}))
        serializer = ItemRequestSerializer(data=itemRequest)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
