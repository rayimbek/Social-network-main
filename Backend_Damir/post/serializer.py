from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','password']


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = '__all__'


class PostVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostVideo
        fields = '__all__'


class PostAudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostAudio
        fields = '__all__'

class Sim(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    videos = serializers.SerializerMethodField()
    audios = serializers.SerializerMethodField()
    liked = serializers.SerializerMethodField()
    bookmarked = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    yours = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    bookmarks_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = '__all__'

    def get_images(self,obj):
        images = obj.postimage_set.all()
        return PostImageSerializer(images, many=True, context=self.context).data if images else None

    def get_videos(self,obj):
        videos = obj.postvideo_set.all()
        return PostVideoSerializer(videos,many=True,context=self.context).data if videos else None

    def get_audios(self,obj):
        audios = obj.postaudio_set.all()
        return PostAudioSerializer(audios,many=True,context=self.context).data if audios else None

    def get_comments_count(self,obj):
        return obj.comments_count

    def get_bookmarks_count(self,obj):
        return obj.bookmark_count

    def get_liked(self,obj):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        like = PostLike.objects.filter(posts=obj,user=user)
        return True if like else False

    def get_bookmarked(self, obj):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, 'user'):
            user = request.user
        bookmark = Bookmark.objects.filter(post=obj,owner=user)
        return True if bookmark else False

    def get_author_name(self,obj):
        return str(obj.author)

    def get_yours(self, obj):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        return True if user == obj.author else False

class CommentSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()
    liked = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    yours = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = '__all__'

    def get_author_name(self, obj):
        return str(obj.owner)

    def get_likes_count(self, obj):
        return obj.likes_count

    def get_liked(self, obj):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        like = CommentLike.objects.filter(comment=obj, user=user)
        return True if like else False

    def get_yours(self,obj):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        return True if user == obj.owner else False

class BookmarkSerializer(serializers.ModelSerializer):
    post = PostSerializer()
    class Meta:
        model = Bookmark
        fields = ['id','post']


class PostMakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['title','text']


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['image','owner']


class ImageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['image','owner','post']


class CreateCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['text','post']


class PostEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['title', 'text']


class CommentEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['text']

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostVideo
        fields = ['owner','video']

class VideoCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostVideo
        fields = ['owner','video','post']

class AudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostAudio
        fields = ['owner','audio']

class AudioCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostAudio
        fields = ['owner','audio','post']
