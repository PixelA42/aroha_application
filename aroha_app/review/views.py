from django.shortcuts import render
from rest_framework import generics, permissions, status, serializers
from rest_framework.response import Response
from .models import Review
from .serializers import ReviewSerializer

# Create your views here.

class ProductReviewList(generics.ListAPIView):
    """
    API view to list reviews for a specific product.
    """
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny] # Anyone can view reviews

    def get_queryset(self):
        """
        Filter reviews based on the product_identifier URL parameter.
        """
        product_identifier = self.kwargs.get('product_identifier')
        if product_identifier:
            return Review.objects.filter(product_identifier=product_identifier)
        return Review.objects.none() # Return empty if no identifier

class ReviewCreate(generics.CreateAPIView):
    """
    API view to create a new review.
    """
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny] # Allow anonymous reviews, check auth in perform_create

    def perform_create(self, serializer):
        """
        Set the user if authenticated, otherwise save anonymously.
        Also ensures product_identifier is saved.
        """
        product_identifier = self.request.data.get('product_identifier')
        if not product_identifier:
             # Use DRF's validation error handling instead of returning Response directly
             raise serializers.ValidationError({"product_identifier": "Product identifier is required."})

        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user, product_identifier=product_identifier)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except serializers.ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
