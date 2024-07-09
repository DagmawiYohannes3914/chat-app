from django.urls import path, include
# from rest_framework.routers import DefaultRouter
from .views import RegisterView, LoginView, UserSearchView, UserListView, LogoutView

# router = DefaultRouter()
# router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('accounts/', UserListView.as_view(), name='user-list'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('search/', UserSearchView.as_view(), name='user-search'),
]
