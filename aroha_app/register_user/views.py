from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from .models import User
from .serializers import UserSerializer, AuthTokenSerializer
from django.http import HttpResponse

class SignUpView(generics.CreateAPIView):
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        serializer.is_valid(raise_exception=True)  # Ensure validation is triggered
        serializer.save()  # Save the user to the database

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)  # Trigger validation explicitly
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class SignInView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = AuthTokenSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user': UserSerializer(user).data}, status=status.HTTP_200_OK)

def homepage_view(request):
    return HttpResponse("Welcome to server homepage")