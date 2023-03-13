from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','id']
class MessageSerializer(serializers.ModelSerializer):
    yours = serializers.SerializerMethodField()
    owner = serializers.SerializerMethodField()
    class Meta:
        model = Message
        fields = '__all__'
    def get_yours(self, obj):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        return True if user == obj.owner else False
    def get_owner(self,obj):
        return obj.owner.username
class MessageSendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['text','owner','chat']
class MessageLoadSerializer(serializers.ModelSerializer):
    messages = serializers.SerializerMethodField()
    class Meta:
        model = Chat
        fields = '__all__'
    def get_messages(self, obj):
        messages = Message.objects.filter(chat=obj)
        return MessageSerializer(messages,many = True).data



class ChatSerializer(serializers.ModelSerializer):
    friend = serializers.SerializerMethodField()
    user = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='username'
    )
    class Meta:
        model = Chat
        fields = '__all__'

    def get_friend(self,obj):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        for i in obj.user.all():
            if not user == i:
                return str(i)
        return None
class CreateChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ['user']