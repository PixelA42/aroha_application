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

    @property
    def total_item_price(self):
        return self.quantity * self.price

    def __str__(self):
        return f"{self.quantity} x {self.product} @ {self.price} in Cart ({self.cart.id})"
