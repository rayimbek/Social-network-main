from asgiref.sync import async_to_sync

from channels.generic.websocket import WebsocketConsumer

import json
from .serializer import MessageSendSerializer, MessageSerializer
from rest_framework.authtoken.models import Token


class ChatConsumer(WebsocketConsumer):

    def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.room_group_name = 'chat_%s' % self.chat_id
        print(self.chat_id)
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept('Token')
        token = self.scope['subprotocols'][1]
        self.client = Token.objects.get(key=token).user

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(text_data_json)
        message = text_data_json['message']
        data = {'text': message, 'chat': self.chat_id, 'owner': self.client.id}

        serializer = MessageSendSerializer(data=data)
        if serializer.is_valid():
            self.messager = serializer.save()
            data = MessageSerializer(self.messager).data
        else:
            print(serializer.errors)
        user = data['owner']
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': data['text'],
                'send_date': data['send_date'],
                'message_id': data['id'],
                'message_owner': user
            }
        )

    def chat_message(self, event):
        message = event['message']
        send_date = event['send_date']
        message_id = event['message_id']
        mes_owner = event['message_owner']
        yours = True if mes_owner == str(self.client) else False
        self.send(text_data=json.dumps({
            'event': "Send",
            'message': message,
            'chat_id': self.chat_id,
            'username': mes_owner,
            'send_date': send_date,
            'message_id': message_id,
            'yours': yours
        }))
