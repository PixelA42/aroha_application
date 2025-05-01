from rest_framework import serializers
from .models import Review
from django.contrib.auth import get_user_model

User = get_user_model()

class ReviewSerializer(serializers.ModelSerializer):
    # Make reviewer_name read-only if user is authenticated, otherwise required
    # We handle this logic in the view
    reviewer_name = serializers.CharField(max_length=100, required=False)
    # Send user's username if available, otherwise null
    user_username = serializers.CharField(source='user.username', read_only=True, allow_null=True)

    class Meta:
        model = Review
        fields = [
            'id',
            'product_identifier',
            'user', # Keep user ID for potential internal use, but maybe hide on list view?
            'user_username', # Display username
            'reviewer_name',
            'rating',
            'text',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'user'] # User is set based on request

    def validate(self, data):
        # If the user is authenticated, we don't need reviewer_name from input
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if 'reviewer_name' in data:
                 # Use the authenticated user's name or username
                 data['reviewer_name'] = request.user.get_full_name() or request.user.username
            else:
                 data['reviewer_name'] = request.user.get_full_name() or request.user.username
        elif 'reviewer_name' not in data or not data['reviewer_name']:
            # If user is anonymous, reviewer_name is required
            raise serializers.ValidationError({"reviewer_name": "This field is required for anonymous reviews."})

        # Ensure rating is provided
        if 'rating' not in data:
             raise serializers.ValidationError({"rating": "This field is required."})

        return data
