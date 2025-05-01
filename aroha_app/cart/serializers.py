from rest_framework import serializers
from .models import Cart, CartItem
from decimal import Decimal # Import Decimal

class CartItemSerializer(serializers.ModelSerializer):
    total_item_price = serializers.ReadOnlyField() # Use the model property

    class Meta:
        model = CartItem
        fields = [
            'id', 
            'product', 
            'product_name', 
            'unit_label', 
            'quantity', 
            'price', 
            'total_item_price'
            # Add 'mrp' field if you add it to the model later for savings calculation
            # 'mrp' 
        ]
        read_only_fields = ['price', 'product_name', 'unit_label'] # Price set when added

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    # Change total_price to a SerializerMethodField
    total_price = serializers.SerializerMethodField() 
    delivery_charge = serializers.SerializerMethodField()
    handling_charge = serializers.SerializerMethodField()
    grand_total = serializers.SerializerMethodField()
    # Optional: Add savings calculation if MRP is available
    # total_savings = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = [
            'id', 
            'user', 
            'date_added', 
            'items', 
            'total_price', 
            'delivery_charge', 
            'handling_charge', 
            'grand_total'
            # 'total_savings'
        ]
        read_only_fields = ['user', 'date_added']

    # Add method to calculate total_price
    def get_total_price(self, obj):
        # Sum the total_item_price from all items in the cart
        # Ensure items exist and total_item_price is valid Decimal
        total = Decimal('0.00')
        if hasattr(obj, 'items') and obj.items.exists():
             for item in obj.items.all():
                 # Access total_item_price via the model's property/method
                 # Assuming CartItem model has a total_item_price property/method
                 item_total = item.total_item_price 
                 if isinstance(item_total, Decimal):
                     total += item_total
                 else:
                     try:
                         total += Decimal(item_total)
                     except Exception:
                         # Handle cases where conversion fails, maybe log an error
                         pass # Or add Decimal('0.00')
        return str(total)


    def get_delivery_charge(self, obj):
        # Calculate total price using the method
        total_price_decimal = Decimal(self.get_total_price(obj)) 
        # Replace with your actual delivery charge logic
        # Example: Free if total_price > 500, else 25
        if total_price_decimal >= Decimal('500.00'):
            return "0.00"
        return "25.00" # Example fixed charge

    def get_handling_charge(self, obj):
        # Replace with your actual handling charge logic
        return "2.00" # Example fixed charge

    def get_grand_total(self, obj):
        # Calculate grand total based on other fields using the methods
        total = Decimal(self.get_total_price(obj))
        handling = Decimal(self.get_handling_charge(obj))
        delivery = Decimal(self.get_delivery_charge(obj))
        return str(total + handling + delivery)

    # Optional: Implement savings calculation if MRP is added to CartItem
    # def get_total_savings(self, obj):
    #     savings = Decimal('0.00')
    #     for item in obj.items.all():
    #         if hasattr(item, 'mrp') and item.mrp:
    #             item_mrp = item.mrp or item.price # Fallback to price if MRP is somehow null
    #             savings += (item_mrp - item.price) * item.quantity
    #     return str(savings)