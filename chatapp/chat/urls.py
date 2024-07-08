from django.urls import path, include

from .views import *

urlpatterns = [
    path('ws/', include('chat.routing'))
]
