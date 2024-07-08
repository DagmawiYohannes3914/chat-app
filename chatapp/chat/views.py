from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .models import Message
from .serializers import MessageSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(sender=user) | Message.objects.filter(receiver=user)

    def create(self, request, *args, **kwargs):
        sender = request.user
        receiver_id = request.data.get('receiver')
        receiver = User.objects.get(id=receiver_id)
        content = request.data.get('content')
        file = request.data.get('file')
        message = Message.objects.create(
            sender=sender, receiver=receiver, content=content, file=file)
        serializer = self.get_serializer(message)
        return Response(serializer.data)
