from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import User
from .serializers import UserSerializer, AuthTokenSerializer
from django.http import HttpResponse

class SignUpView(generics.CreateAPIView):
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "status": "error",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        return Response({
            "status": "success",
            "message": "User registered successfully.",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)

class SignInView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = AuthTokenSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "status": "success",
            "message": "User signed in successfully.",
            "data": {
                "token": token.key,
                "user": UserSerializer(user).data,
                "is_new_token": created
            }
        }, status=status.HTTP_200_OK)

class UserDetailView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return Response({
            "status": "success",
            "message": "User details retrieved successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

def homepage_view(request):
    return HttpResponse("Welcome to server homepage")
