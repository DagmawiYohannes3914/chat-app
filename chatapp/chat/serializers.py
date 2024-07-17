from rest_framework import serializers
from .models import Message
from django.contrib.auth.models import User


class MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        fields = '__all__'
        
    def create(self, validated_data):
        file = validated_data.pop('file', None)
        instance = self.Meta.model(**validated_data)
        if file:
            instance.file = file
        instance.save()
        return instance


# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email']
