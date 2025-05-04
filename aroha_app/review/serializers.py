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
            'comment',  # changed from 'text' to 'comment'
            'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'user'] # User is set based on request

    def validate(self, data):
        # If the user is authenticated, we don't need reviewer_name from input
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Always use the authenticated user's actual name
            data['reviewer_name'] = request.user.name # Use the 'name' field
            # Assign the user object itself
            data['user'] = request.user
        elif 'reviewer_name' not in data or not data['reviewer_name']:
            # If user is anonymous, reviewer_name is required
            raise serializers.ValidationError({"reviewer_name": "This field is required for anonymous reviews."})
        # else: user is anonymous and provided reviewer_name, keep it

        # Ensure rating is provided
        if 'rating' not in data:
             raise serializers.ValidationError({"rating": "This field is required."})

        # Check if authenticated user has already reviewed this product
        if request and request.user.is_authenticated:
            product_identifier = data.get('product_identifier')
            user = request.user
            if Review.objects.filter(product_identifier=product_identifier, user=user).exists():
                raise serializers.ValidationError("You have already reviewed this product.")

        return data
