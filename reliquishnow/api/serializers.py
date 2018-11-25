from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'user_id',
            'user_first_name',
            'user_last_name',
            'user_email',
            'user_desc',
            'is_active',
            'is_deleted'
        )
        model = User


class UserImageSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'image_id',
            'user',
            'image',
            'image_created_time',
            'image_updated_time',
            'is_deleted'
        )
        model = UserImage