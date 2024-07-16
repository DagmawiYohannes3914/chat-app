from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, LoginView, UserSearchView, UserViewSet, LogoutView, UserDetailView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'users/me', UserDetailView, basename='current-user')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('search/', UserSearchView.as_view(), name='user-search'),

]
