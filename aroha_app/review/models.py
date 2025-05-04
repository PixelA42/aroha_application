from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

class Review(models.Model):
    # Link to the user who wrote the review 
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL, # Keep review even if user is deleted
        null=True,
        blank=True,
        related_name='reviews'
    )
    # Store product identifier directly (e.g., ID or SKU)
    product_identifier = models.CharField(max_length=255, db_index=True)
    # Fields for anonymous reviews if user is not logged in
    reviewer_name = models.CharField(max_length=100, blank=True, null=True)
    reviewer_email = models.EmailField(blank=True, null=True) # Optional email for anonymous

    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_approved = models.BooleanField(default=False) # For moderation

    def __str__(self):
        # Use self.user.email instead of self.user.username
        user_info = self.user.email if self.user else self.reviewer_name
        return f"Review for {self.product_identifier} by {user_info} ({self.rating} stars)"

    class Meta:
        ordering = ['-created_at'] # Show newest reviews first
        # Ensure a user can only review a specific product once (if using user FK)
        # unique_together = ('user', 'product_identifier') # Uncomment if anonymous reviews are disallowed
