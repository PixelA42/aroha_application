from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import ContactMessage, Subscriber
from .serializers import ContactMessageSerializer, SubscriberSerializer
from django.core.mail import send_mail, BadHeaderError
from django.core.exceptions import ImproperlyConfigured

class ContactMessageView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        contact_message = serializer.save()  # Save the instance

        try:
            send_mail(
                subject=f"New Contact Message from {contact_message.name}",
                message=f"Subject: {contact_message.subject}\n\nMessage:\n{contact_message.message}\n\nFrom: {contact_message.email}",
                from_email=contact_message.email,
                recipient_list=['aroha@support.com'],
                fail_silently=False,
            )
        except (ConnectionRefusedError, BadHeaderError, ImproperlyConfigured) as e:
            return Response({'detail': f'Email sending failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

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
            response = super().create(request, *args, **kwargs)

            # Send subscription confirmation email
            send_mail(
                subject="Subscription Confirmation",
                message="Thank you for subscribing to our service!",
                from_email='aroha@support.com',
                recipient_list=[email],
                fail_silently=False,
            )

            return response
        except Exception as e:
            return Response({'detail': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
