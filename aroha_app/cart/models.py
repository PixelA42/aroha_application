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
    product = models.CharField(max_length=255) # Product identifier (e.g., SKU or ID)
    product_name = models.CharField(max_length=255, default='Unknown Product') # Store name for display
    unit_label = models.CharField(max_length=50, blank=True, null=True) # Store unit label for display
    image_url = models.URLField(max_length=500, blank=True, null=True) # Store image URL for display
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
        # Use product_name for display
        return f"{self.quantity} x {self.product_name} @ {self.price}{mrp_str} in Cart ({self.cart.id})"

class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    status = models.CharField(max_length=50, choices=[
        ('Pending', 'Pending'),
        ('Processing', 'Processing'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ], default='Pending')
    shipping_address = models.TextField(blank=True, null=True) # Consider using a structured address model later
    billing_address = models.TextField(blank=True, null=True) # Consider using a structured address model later
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    payment_status = models.CharField(max_length=50, default='Pending') # e.g., Pending, Paid, Failed

    def __str__(self):
        # Use self.user.email instead of self.user.username
        return f"Order {self.id} by {self.user.email} - {self.status}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    # Store product details directly in the order item
    product_identifier = models.CharField(max_length=255) # Use a generic identifier (ID, SKU, etc.)
    product_name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2) # Price at the time of order
    mrp = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) # MRP at the time of order
    unit_label = models.CharField(max_length=50, blank=True, null=True) # Unit label at the time of order
    image_url = models.URLField(max_length=500, blank=True, null=True) # Image URL at the time of order

    @property
    def total_item_price(self):
        return self.quantity * self.price

    def __str__(self):
        return f"{self.quantity} x {self.product_name} (Order: {self.order.id})"
