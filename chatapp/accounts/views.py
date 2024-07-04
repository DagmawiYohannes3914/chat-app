from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from .serializers import UserSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(id=response.data['id'])
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        print(f"Username: {username}, Password: {password}")

        user = authenticate(username=username, password=password)
        print(f"Authenticated User: {user}")
        if user is not None:
            refresh = RefreshToken.for_user(user)
            print(f"User authenticated: {user}")
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        print("Invalid credentials")
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)
