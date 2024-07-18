from rest_framework import viewsets, status, generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Message
from .serializers import MessageSerializer
import logging
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)

User = get_user_model()


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        sender = request.user
        receiver_id = request.data.get('receiver')
        receiver = User.objects.get(id=receiver_id)
        content = request.data.get('content')
        file = request.data.get('file')

        logger.info(
            f"Creating message from {sender} to {receiver} with content: {content}")

        message = Message.objects.create(
            sender=sender, receiver=receiver, content=content, file=file
        )
        serializer = self.get_serializer(message)
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        user = request.user
        messages = Message.objects.filter(
            sender=user) | Message.objects.filter(receiver=user)
        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(sender=user) | Message.objects.filter(receiver=user)
