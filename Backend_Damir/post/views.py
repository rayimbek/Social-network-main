
from django.shortcuts import render
from .serializer import *
from .models import *
from rest_framework.decorators import *
from rest_framework.response import Response
from rest_framework import viewsets, permissions, generics
from django.contrib.auth.models import User
from rest_framework.renderers import JSONRenderer
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from .permissions import *


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


@api_view(['POST'])
@permission_classes((AllowAny,))
def register(request):
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = User.objects.create_user(serializer.validated_data['username'],None,serializer.validated_data['password'])
        Token.objects.get_or_create(user=user)
        return Response('Registered')
    else:
        return Response(serializer.errors)


@api_view(['GET'])
@permission_classes((permissions.IsAuthenticated,))
def author_posts(request, pk):
    posts = Post.objects.filter(author_id=pk)
    data = PostSerializer(posts, many=True, context={'request': request}).data
    return Response(data)

@api_view(['GET'])
@permission_classes((permissions.IsAuthenticated,))
def own_posts(request):
    posts = Post.objects.filter(author=request.user)
    data = PostSerializer(posts, many=True, context={'request': request}).data
    return Response(data)

@api_view(['GET'])
@permission_classes((permissions.IsAuthenticated,))
def post_comments(request, pk):
    comments = Comment.objects.filter(post_id=pk)
    data = CommentSerializer(comments, many=True, context={'request': request}).data
    return Response(data)

@api_view(['GET'])
@permission_classes((permissions.IsAuthenticated,))
def all_posts(request):
    posts = Post.objects.all().order_by('-pub_date')
    data = PostSerializer(posts, many=True, context={'request': request}).data
    return Response(data)


@api_view(['GET'])
@permission_classes((permissions.IsAuthenticated,))
def bookmarked_posts(request):
    posts = request.user.bookmark_set.all()
    data = BookmarkSerializer(posts, many=True, context={'request': request}).data
    return Response(data)


@api_view(['POST'])
@permission_classes((permissions.IsAuthenticated,))
def make_post(request):
    print(request.data)
    print('------------------')
    data = dict(request.data.lists())
    videos = []
    images = []
    audios = []
    has_image = False
    has_video = False
    has_audio = False

    if 'video' in data:
        for video in data['video']:
            videos.append({'video' : video,'owner' : request.user.id})
        video_check = VideoSerializer(data=videos, many=True)
        if video_check.is_valid():
            has_video = True
        else:
            return Response(video_check.errors)
    if 'image' in data:
        for image in data['image']:
            print('---',type(image))
            images.append({'image' : image,'owner' : request.user.id})
        print(data['image'])
        print('--------------------')
        print(type(data['image']))
        image_check = ImageSerializer(data=images, many=True)
        if image_check.is_valid():
            has_image = True
        else:
            return Response(image_check.errors)
    if 'audio' in data:
        for audio in data['audio']:
            audios.append({'audio' : audio,'owner' : request.user.id})
        audio_check = AudioSerializer(data=audios, many=True)
        if audio_check.is_valid():
            has_audio = True
        else:
            return Response(audio_check.errors)

    post_check = PostMakeSerializer(data=request.data)
    if post_check.is_valid():
        post = post_check.save(author=request.user)
        if has_image:
            for image in images:
                image['post'] = post.id
            image_create_serializer = ImageCreateSerializer(data=images, many=True, context={'request': request})
            if image_create_serializer.is_valid():
                image_create_serializer.save()
            else:
                return Response(image_create_serializer.errors)
        if has_video:
            for video in videos:
                video['post'] = post.id
            video_create_serializer = VideoCreateSerializer(data=videos, many=True, context={'request': request})
            if video_create_serializer.is_valid():
                video_create_serializer.save()
            else:
                return Response(video_create_serializer.errors)
        if has_audio:
            for audio in audios:
                audio['post'] = post.id
            audio_create_serializer = AudioCreateSerializer(data=audios, many=True, context={'request': request})
            if audio_create_serializer.is_valid():
                audio_create_serializer.save()
            else:
                return Response(audio_create_serializer.errors)
    else:
        return Response(post_check.errors)

    return Response({'post': post_check.data,'images': image_create_serializer.data if has_image else None,'videos':video_create_serializer.data if has_video else None,'audios':audio_create_serializer.data if has_audio else None,})



@api_view(['POST'])
@permission_classes((permissions.IsAuthenticated,))
def create_comment(request):
    serializer = CreateCommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(owner=request.user)
        return Response(serializer.data)
    else:
        return Response(serializer.errors)


class PostLikeView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    def retrieve(self, request,*args, **kwargs):
        instance = self.get_object()
        obj, cond = PostLike.objects.get_or_create(posts=instance, user=request.user)
        if not cond:
            obj.delete()
        return Response({"Liked": cond,'likes_count': instance.likes_count})


class CommentLikeView(generics.RetrieveAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    def retrieve(self, request,*args, **kwargs):
        instance = self.get_object()
        obj, cond = CommentLike.objects.get_or_create(comment=instance, user=request.user)
        if not cond:
            obj.delete()
        return Response({"Liked": cond,'likes_count': instance.likes_count})


class PostMarkView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    def retrieve(self, request,*args, **kwargs):
        instance = self.get_object()
        obj, cond = Bookmark.objects.get_or_create(post=instance, owner=request.user)
        if not cond:
            obj.delete()
        return Response(cond)


class PostUpdate(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,PostPermission)
    queryset = Post.objects.all()
    serializer_class = PostEditSerializer
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.user = request.user
        instance.save()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class CommentUpdate(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,CommentPermission)
    queryset = Comment.objects.all()
    serializer_class = CommentEditSerializer
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.user = request.user
        instance.save()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes((permissions.IsAuthenticated, CommentPermission))
def delete_comment(request,pk):
    comment = Comment.objects.get(id=pk)
    comment.delete()
    return Response('Deleted')


@api_view(['DELETE'])
@permission_classes((permissions.IsAuthenticated, PostPermission))
def delete_post(request,pk):
    post = Post.objects.get(id=pk)
    post.delete()
    return Response('Deleted')
