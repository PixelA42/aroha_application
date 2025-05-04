from django.db import models
from django.conf import settings
from decimal import Decimal

class Order(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('COD', 'Cash on Delivery'),
        ('ONLINE', 'Online Payment'), # Add more later if needed
    ]
    ORDER_STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('SHIPPED', 'Shipped'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    created_at = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='PENDING')
    # Add address fields later if needed
    # shipping_address = models.TextField(blank=True, null=True)
    # billing_address = models.TextField(blank=True, null=True)

    def __str__(self):
        # Make absolutely sure this line uses .email
        return f"Order {self.id} by {self.user.email} - {self.status}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product_identifier = models.CharField(max_length=255) # Matches CartItem's product field
    product_name = models.CharField(max_length=255) # Store name for easier display
    unit_label = models.CharField(max_length=50, blank=True, null=True) # Store unit label
    image_url = models.URLField(max_length=500, blank=True, null=True) # Store image URL
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2) # Price per unit at time of order

    @property
    def total_item_price(self):
        return self.quantity * self.price

    def __str__(self):
        return f"{self.quantity} x {self.product_name} in Order {self.order.id}"
