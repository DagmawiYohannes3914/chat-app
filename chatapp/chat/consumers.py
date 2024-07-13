import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import logging
from django.contrib.auth import get_user_model
from .models import Message

logger = logging.getLogger(__name__)

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        if not self.room_name:
            await self.close()
            return
        self.room_group_name = f'chat_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        logger.info(
            f"WebSocket connected: {self.channel_name} to room: {self.room_group_name}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        logger.info(
            f"WebSocket disconnected: {self.channel_name} from room: {self.room_group_name}")

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_data = text_data_json['message']

        sender_id = message_data['sender']
        receiver_id = message_data['receiver']
        content = message_data['content']

        sender = await database_sync_to_async(User.objects.get)(id=sender_id)
        receiver = await database_sync_to_async(User.objects.get)(id=receiver_id)

        message = await database_sync_to_async(Message.objects.create)(
            sender=sender, receiver=receiver, content=content
        )
        if message:
            logger.info(f"Message saved: {message}")

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': {
                    'id': message.id,
                    'sender': sender_id,
                    'receiver': receiver_id,
                    'content': content,
                    'timestamp': str(message.timestamp),
                }
            }
        )
        logger.info(
            f"Message received: {message} in room: {self.room_group_name}")

    async def chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': {
                'id': message['id'],
                'sender': message['sender'],
                'receiver': message['receiver'],
                'content': message['content'],
                'timestamp': message['timestamp'],
            }
        }))
        logger.info(
            f"Message sent: {message} to WebSocket: {self.channel_name}")
