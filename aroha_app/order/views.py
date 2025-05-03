from django.shortcuts import render, get_object_or_404
from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order, OrderItem
from cart.models import Cart, CartItem
from .serializers import OrderSerializer, PlaceOrderSerializer
from django.db import transaction

class PlaceOrderView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = PlaceOrderSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        payment_method = serializer.validated_data['payment_method']

        try:
            cart = Cart.objects.get(user=request.user)
            cart_items = CartItem.objects.filter(cart=cart)

            if not cart_items.exists():
                return Response({'error': 'Your cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

            # Calculate total amount from cart items
            total_amount = sum(item.total_item_price for item in cart_items)
            # Add delivery/handling charges if applicable (fetch from cart or recalculate)
            # For simplicity, using cart's grand_total if available, otherwise just item total
            # This assumes Cart model has grand_total calculation or you fetch it separately
            # grand_total = getattr(cart, 'grand_total', total_amount) # Example
            grand_total = total_amount # Simplification: Use item total for now

            with transaction.atomic(): # Ensure all operations succeed or fail together
                # Create the Order
                order = Order.objects.create(
                    user=request.user,
                    total_amount=grand_total, # Use the calculated total
                    payment_method=payment_method,
                    status='PENDING' # Initial status
                )

                # Create OrderItems from CartItems
                order_items_to_create = []
                for item in cart_items:
                    order_items_to_create.append(
                        OrderItem(
                            order=order,
                            product_identifier=item.product, # Use the identifier string
                            product_name=getattr(item, 'product_name', 'Unknown Product'), # Get name if available
                            unit_label=getattr(item, 'unit_label', ''), # Get label if available
                            image_url=getattr(item, 'image_url', None), # <<< ADD THIS LINE
                            quantity=item.quantity,
                            price=item.price # Price at the time of adding to cart
                        )
                    )
                
                OrderItem.objects.bulk_create(order_items_to_create)

                # Clear the cart
                cart_items.delete()
                # Optionally delete the cart itself if it's always 1-1 with user
                # cart.delete() 

            # Serialize the created order
            order_serializer = OrderSerializer(order)
            return Response({
                'message': 'Order placed successfully!',
                'order': order_serializer.data
            }, status=status.HTTP_201_CREATED)

        except Cart.DoesNotExist:
            return Response({'error': 'Cart not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Log the error e
            print(f"Error placing order: {e}")
            return Response({'error': 'An unexpected error occurred while placing the order.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class OrderHistoryView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        # Return orders for the current user, newest first
        return Order.objects.filter(user=self.request.user).order_by('-created_at')
