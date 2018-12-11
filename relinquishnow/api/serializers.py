from rest_framework import serializers

from .models import *


class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        fields = (
            'user_id',
            'user_first_name',
            'user_last_name',
            'user_email',
            'user_birthday',
            'user_unique_name',
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
        

class HelpCenterSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'hc_id',
            'hc_name',
            'hc_desc',
            'hc_address',
            'hc_city',
            'hc_state',
            'hc_country',
            'hc_starting_year',
            'hc_phone',
            'hc_email',
            'hc_website'
        )
        model = HelpCenter        

