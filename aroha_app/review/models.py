from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

# Assuming you have a Product model somewhere, replace 'product.Product' if needed
# If products are identified by an ID from another system, adjust accordingly.
# For now, using a simple CharField for product_identifier.

class Review(models.Model):
    # Link to the product being reviewed. Using an identifier for flexibility.
    # If you have a local Product model, use models.ForeignKey('product.Product', ...)
    product_identifier = models.CharField(max_length=255, db_index=True)
    # Allow anonymous reviews, but link to user if logged in
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews')
    # If user is not logged in, store the name they provide
    reviewer_name = models.CharField(max_length=100)
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at'] # Show newest reviews first

    def __str__(self):
        user_info = self.user.username if self.user else self.reviewer_name
        return f"Review for {self.product_identifier} by {user_info} ({self.rating} stars)"
