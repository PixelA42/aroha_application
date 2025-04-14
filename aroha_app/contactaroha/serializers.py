from rest_framework import serializers
from .models import ContactMessage, Subscriber

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject', 'message', 'created_at']

class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = ['id', 'email', 'subscribed_at']

    def validate_email(self, value):
        if Subscriber.objects.filter(email=value).exists():
            raise serializers.ValidationError('This email is already subscribed.')
        return value
