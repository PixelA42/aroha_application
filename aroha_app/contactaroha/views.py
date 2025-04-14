from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import ContactMessage, Subscriber
from .serializers import ContactMessageSerializer, SubscriberSerializer

class ContactMessageView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

class SubscriberView(generics.CreateAPIView):
    queryset = Subscriber.objects.all()
    serializer_class = SubscriberSerializer

    def create(self, request, *args, **kwargs):
        email = request.data.get('email')
        if not email:
            return Response({'detail': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if Subscriber.objects.filter(email=email).exists():
            return Response({'detail': 'Email is already subscribed.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response({'detail': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
