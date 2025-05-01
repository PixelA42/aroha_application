from django.db import models
from django.conf import settings
from decimal import Decimal # Import Decimal

class Cart(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart for {self.user.username} ({self.id})"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00')) # Price at time of adding
    mrp = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) # Add MRP field

    @property
    def total_item_price(self):
        return self.quantity * self.price
    
    # Optional: Add property for item savings
    @property
    def item_savings(self):
        if self.mrp and self.mrp > self.price:
            return (self.mrp - self.price) * self.quantity
        return Decimal('0.00')

    def __str__(self):
        mrp_str = f" (MRP: {self.mrp})" if self.mrp else ""
        return f"{self.quantity} x {self.product} @ {self.price}{mrp_str} in Cart ({self.cart.id})"
