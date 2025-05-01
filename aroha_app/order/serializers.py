from rest_framework import serializers
from .models import Order, OrderItem
from register_user.serializers import UserSerializer # Assuming you have this

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product_identifier', 'product_name', 'unit_label', 'quantity', 'price', 'total_item_price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True) # Display user details
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'created_at', 'total_amount', 
            'payment_method', 'payment_method_display', 
            'status', 'status_display', 'items'
        ]
        read_only_fields = ['user', 'created_at', 'total_amount', 'status', 'items'] # Fields set by backend

class PlaceOrderSerializer(serializers.Serializer):
    payment_method = serializers.ChoiceField(choices=Order.PAYMENT_METHOD_CHOICES)
    # Add address fields here if/when implemented
    # shipping_address = serializers.CharField(required=False, allow_blank=True)
    # billing_address = serializers.CharField(required=False, allow_blank=True)
