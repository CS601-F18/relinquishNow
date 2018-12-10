from django.contrib import admin

from .models import * 


admin.site.register(User)
admin.site.register(HelpCenter)
admin.site.register(UserFollower)
admin.site.register(UserImage)
admin.site.register(ContactRequest)
admin.site.register(PostType)
admin.site.register(Post)
admin.site.register(PostReceipient)
admin.site.register(PostFile)
admin.site.register(PostLike)
admin.site.register(PostComment)
