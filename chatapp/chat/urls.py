from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import MessageViewSet
from .routing import websocket_urlpatterns

router = DefaultRouter()
router.register(r'messages', MessageViewSet, basename='message')

urlpatterns = [
    path('', include(router.urls)),
    path('ws/', include(websocket_urlpatterns)),
]
