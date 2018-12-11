import datetime
import os

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import RegexValidator
from django.db import models


class ObjectQuerySet(models.QuerySet):

    def delete(self, *args, **kwargs):
        for obj in self:
            obj.is_deleted = True
            obj.save()


class UserManager(BaseUserManager):

    def create_user(self, user_email, password):
        user = self.model(user_email=user_email, password=password)
        user.set_password(password)
        user.is_staff = False
        user.is_superuser = False
        user.save(using=self._db)
        return user

    def create_superuser(self, user_email, password):
        user = self.create_user(user_email=user_email, password=password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

    def get_by_natural_key(self, user_email_):
        return self.get(user_email=user_email_)
    
    def get_queryset(self):
        return ObjectQuerySet(self.model, using=self._db).filter(is_deleted=False)


class User(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    user_first_name = models.CharField(max_length=64)
    user_last_name = models.CharField(max_length=64)
    user_unique_name = models.CharField(max_length=128, unique=True, blank=True, null=True)
    user_email = models.EmailField(unique=True)
    user_phone = models.CharField(max_length=16, validators=[RegexValidator(r'^[-+]?[0-9]+$')], null=True, blank=True)
    user_birthday = models.DateField(null=True, blank=True)
    user_desc = models.CharField(max_length=1200, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    created_time = models.DateTimeField(auto_now_add=True)
    modified_time = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'user_email'
    EMAIL_FIELD = 'user_email'
    objects = UserManager()

    def __str__(self):
        return self.user_email

    def get_short_name(self):
        return self.user_first_name

    def get_full_name(self):
        return self.user_first_name + ' ' + self.user_last_name

    def get_username(self):
        return self.user_email

    def delete(self, *args, **kwargs):
        self.is_deleted = True
        self.save()

    class Meta:
        db_table = 'user'


class UserFollower(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.IntegerField()
    follower_user_id = models.IntegerField()
    followed_time_added = models.DateTimeField(auto_now_add=True)
    followed_time_updated = models.DateTimeField(auto_now=True)
    follow_status = models.BooleanField(default=True)

    def __str__(self):
        return str(self.user_id) + '-' + str(self.followed_user_id)

    class Meta:
        unique_together = ('user_id', 'follower_user_id')
        db_table = 'user_followers'


def get_user_image_path(instance, filename):
    return os.path.join('users', str(instance.user.user_id), 'images', filename)
        
class UserImage(models.Model):
    image_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('User', to_field='user_id', null=True, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=get_user_image_path, null=True, blank=True)
    image_is_current = models.BooleanField(default=True)
    image_created_time = models.DateTimeField(auto_now_add=True)
    image_updated_time = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)
    
    def delete(self, *args, **kwargs):
        self.is_deleted = True
        self.save()
    
    def __str__(self):
        return str(self.user.user_id) + '-' + str(self.image.name)

    class Meta:
        db_table = 'user_images'


def get_hc_logo_path(instance, filename):
    return os.path.join('helpcenters', str(instance.hc_id), filename)

class HelpCenter(models.Model):
    hc_id = models.AutoField(primary_key=True)
    hc_name = models.CharField(max_length=128)
    hc_desc = models.CharField(max_length=1024, null=True, blank=True)
    hc_logo = models.ImageField(upload_to=get_hc_logo_path, null=True, blank=True)
    hc_address = models.CharField(max_length=256, null=True, blank=True)
    hc_city = models.CharField(max_length=128, null=True, blank=True)
    hc_state = models.CharField(max_length=128, null=True, blank=True)
    hc_country = models.CharField(max_length=128, null=True, blank=True)
    hc_starting_year = models.DateField(null=True, blank=True)
    hc_phone = models.CharField(
        max_length=21,
        validators=[RegexValidator(r'^[-+]?[0-9]+$')],
        null=True,
        blank=True)
    hc_email = models.EmailField(null=True, blank=True)
    hc_website = models.CharField(max_length=1200, null=True, blank=True)
    is_deleted = models.BooleanField(default=False)

    def delete(self, *args, **kwargs):
        self.is_deleted = True
        self.save()

    def __str__(self):
        return str(self.hc_id) + '-' + self.hc_name

    class Meta:
        db_table = 'help_centers'



class ItemImage(models.Model):
    image_id = models.AutoField(primary_key=True)
    item = models.ForeignKey('Item', to_field='item_id', null=True, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=get_user_image_path, null=True, blank=True)
    image_created_time = models.DateTimeField(auto_now_add=True)
    image_updated_time = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)
    
    def delete(self, *args, **kwargs):
        self.is_deleted = True
        self.save()
    
    def __str__(self):
        return str(self.user.user_id) + '-' + str(self.image.name)

    class Meta:
        unique_together = ('item', 'image')
        db_table = 'item_images'
        

class Item(models.Model):
    item_id = models.AutoField(primary_key=True)
    item_name = models.CharField(max_length=512)
    item_desc = models.CharField(max_length=1024, null=True, blank=True)
    item_creator = models.ForeignKey('User', to_field='user_id', on_delete=models.SET_NULL, null=True)
    item_created_time = models.DateTimeField(auto_now_add=True)
    item_updated_time = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)
    
    def delete(self, *args, **kwargs):
        self.is_deleted = True
        self.save()

    def __str__(self):
        return str(self.item_id) + '-' + self.item_name

    class Meta:
        unique_together = ('item_name', 'item_creator')
        db_table = 'items'
 
 
class ItemRequests(models.Model):
    item_request_id = models.AutoField(primary_key=True)
    item_id = models.IntegerField(null=False, blank=False)
    requested_user_id = models.IntegerField(null=False, blank=False)
    request_created_time = models.DateTimeField(auto_now_add=True)
    request_updated_time = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)
    
    def delete(self, *args, **kwargs):
        self.is_deleted = True
        self.save()

    def __str__(self):
        return str(self.item_id) + '-' + str(self.requested_user_id)

    class Meta:
        unique_together = ('item_id', 'requested_user_id')
        db_table = 'item_requests'        

        
class ContactRequest(models.Model):    
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$',
                                 message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")

    id = models.AutoField(primary_key=True)
    user_name = models.CharField(max_length=64)
    user_email = models.EmailField()
    user_phone = models.CharField(validators=[phone_regex], max_length=17, blank=True)
    user_subject = models.TextField(max_length=128)
    user_message = models.TextField(max_length=1200)
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user_name + '-' + str(self.created_at)

    class Meta:
        db_table = 'contact_us'


class PostType(models.Model):
    post_type_id = models.AutoField(primary_key=True)
    post_type = models.CharField(max_length=50)
    post_type_desc = models.CharField(max_length=100)
    post_type_created_time = models.DateTimeField(auto_now_add=True)
    post_type_updated_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'post_types'
        
        
class Post(models.Model):
    post_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey('User', to_field='user_id', on_delete=models.SET_NULL, blank=True, null=True)
    post_type = models.ForeignKey('PostType', to_field='post_type_id', on_delete=models.SET_NULL, blank=True, null=True)
    post_text = models.TextField(blank=True, null=True)
    post_ref_object = models.IntegerField(null=True, blank =True)
    post_created_datetime = models.DateTimeField(auto_now_add=True)
    post_updated_datetime = models.DateTimeField(auto_now=True)
    post_public_flag = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'posts'

# This is added iff we tag user in the post.
class PostReceipient(models.Model):
    pr_post_id = models.ForeignKey('Post', to_field='post_id', on_delete=models.SET_NULL, blank=True, null=True)
    pr_recepient_id = models.ForeignKey('User', to_field='user_id', on_delete=models.SET_NULL, blank=True, null=True)
    
    class Meta:
        db_table = 'post_recipients'

def get_post_file_upload_path(instance, filename):
    return os.path.join('posts', str(instance.post.post_id), datetime.datetime.now().strftime('%y-%m-%d-%H-%M-%S-') + filename)


class PostFile(models.Model):
    post_file_id = models.AutoField(primary_key=True)
    post = models.ForeignKey('Post', to_field='post_id', on_delete=models.SET_NULL, blank=True, null=True)
    post_file = models.FileField(upload_to=get_post_file_upload_path, null=True, blank=True)

    def __str__(self):
        return str(self.post.post_id) + '-' + str(self.file_id)

    class Meta:
        db_table = 'post_files'
        

class PostLike(models.Model):
    post_like_id = models.AutoField(primary_key=True)
    post = models.ForeignKey('Post', to_field='post_id', on_delete=models.SET_NULL, blank=True, null=True)
    user = models.ForeignKey('User', to_field='user_id', on_delete=models.SET_NULL, blank=True, null=True)
    post_like_status = models.BooleanField(default=False)
    post_like_datetime = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.post.post_id) + '-' + str(self.user.user_id)

    class Meta:
        unique_together = ('post', 'user')
        db_table = 'post_likes'


class PostComment(models.Model):
    post_comment_id = models.AutoField(primary_key=True)
    post = models.ForeignKey('Post', to_field='post_id', on_delete=models.SET_NULL,blank=True,null=True)
    user = models.ForeignKey('User', to_field='user_id', on_delete=models.SET_NULL,blank=True,null=True)
    post_comment_text = models.CharField(max_length=256, default=None)
    post_comment_datetime = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('post', 'user')
        db_table = 'post_comments'
        

def get_item_image_path(instance, filename):
    return os.path.join('items', str(instance.item.item_id), 'images', filename)

