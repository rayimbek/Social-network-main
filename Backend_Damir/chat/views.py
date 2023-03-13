from .serializer import *
from .models import *
from rest_framework.decorators import *
from rest_framework.response import Response
from rest_framework import viewsets, permissions, generics
from django.contrib.auth.models import User
import django_filters
from rest_framework import filters
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('?')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated,]

class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated,]
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend, filters.SearchFilter]
    # filterset_fields = ['username']
    search_fields = ['^username']

@api_view(['GET'])
@permission_classes((permissions.IsAuthenticated,))
def load_chats(request):
    chats = Chat.objects.filter(user=request.user).order_by('-created_date')
    data = ChatSerializer(chats, many=True, context={'request': request}).data
    return Response(data)

@api_view(['GET'])
@permission_classes((permissions.IsAuthenticated,))
def load_messages(request,pk):
    messages = Message.objects.filter(chat_id=pk).order_by('send_date')
    data = MessageSerializer(messages, many=True, context={'request': request}).data
    return Response({'messages':data})


@api_view(['POST'])
@permission_classes((permissions.IsAuthenticated,))
def create_chat(request):
    chats = Chat.objects.filter(user=request.user)
    exists = False
    chat_id = 0
    for chat in chats:
        if int(request.data['user']) in chat.user.values_list()[0] or int(request.data['user']) in chat.user.values_list()[1]:
            exists = True
            chat_id = chat.id
    serializer = CreateChatSerializer(data=request.data)
    if serializer.is_valid():
        if not exists:
            users = [request.user.id,request.data['user']]
            chat = serializer.save(user=users)
            return Response(chat.id)
        else:
            return Response(chat_id)
    else:
        return Response(serializer.errors)
