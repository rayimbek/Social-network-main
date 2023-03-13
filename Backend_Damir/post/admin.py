from django.contrib import admin
from .models import *

admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(CommentLike)
admin.site.register(PostLike)
admin.site.register(Bookmark)
admin.site.register(PostImage)
admin.site.register(PostVideo)
admin.site.register(PostAudio)
