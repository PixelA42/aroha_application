from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
import json
from .models import Cart, CartItem
# Remove the top-level import of Product
# from register_user.models import Product
from decimal import Decimal
# Import Serializers
from .serializers import CartSerializer, CartItemSerializer

# Import DRF decorators and permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response # Use DRF Response
from rest_framework import status # Use DRF status codes

# --- add_to_cart view (Updated with DRF) ---
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    # REMOVE: from register_user.models import Product (Product model doesn't exist there)
    try:
        data = request.data
        product_id = data.get('product_id') # This is likely the identifier string
        quantity = int(data.get('quantity', 1))
        price = data.get('price') # Price at the time of adding
        mrp = data.get('mrp') # Get MRP from request data

        # Validate required fields from request
        if not product_id or price is None: # MRP is optional for savings calculation, but price is needed
            return Response({'error': 'Missing product_id or price'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            price_decimal = Decimal(price)
            mrp_decimal = Decimal(mrp) if mrp is not None else None # Convert MRP if provided
        except Exception:
             return Response({'error': 'Invalid price or MRP format'}, status=status.HTTP_400_BAD_REQUEST)

        cart, created = Cart.objects.get_or_create(user=request.user)

        # Use the product_id string directly for the CharField 'product'
        # Include mrp in defaults
        cart_item, item_created = CartItem.objects.get_or_create(
            cart=cart,
            product=str(product_id), # Use the product_id string here
            defaults={'quantity': quantity, 'price': price_decimal, 'mrp': mrp_decimal} # Add mrp to defaults
        )

        if not item_created:
            cart_item.quantity += quantity
            # Decide if price/mrp should be updated if item already exists
            # cart_item.price = price_decimal # Uncomment if price should update
            # cart_item.mrp = mrp_decimal # Uncomment if MRP should update
            cart_item.save()
            status_code = status.HTTP_200_OK
            message = 'Item quantity updated in cart'
        else:
            # Price and MRP are already set via defaults
            status_code = status.HTTP_201_CREATED
            message = 'Item added to cart'

        # Serialize the created/updated item
        item_serializer = CartItemSerializer(cart_item)

        # Fetch the updated cart to return its serialized state including total savings
        cart.refresh_from_db()
        cart_serializer = CartSerializer(cart)

        return Response({
            'message': message,
            'cart_item': item_serializer.data, # Return serialized item data
            'cart': cart_serializer.data # Return updated cart data
        }, status=status_code)

    except Exception as e:
        print(f"Error adding to cart: {e}") # Log the error
        # Return a more specific error if possible, otherwise generic
        return Response({'error': f'An unexpected error occurred: {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# --- View: Get Cart Details (Updated with DRF) ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_cart(request):
    try:
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    except Exception as e:
        print(f"Error viewing cart: {e}")
        return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# --- View: Update Cart Item Quantity (Updated with DRF) ---
@api_view(['PUT']) # Should likely be PATCH or PUT
@permission_classes([IsAuthenticated])
def update_cart_item(request, item_product_id):
    # REMOVE: from register_user.models import Product
    try:
        data = request.data
        new_quantity = int(data.get('quantity'))

        cart = get_object_or_404(Cart, user=request.user)
        # Query CartItem using the product CharField directly
        cart_item = get_object_or_404(CartItem, cart=cart, product=str(item_product_id))

        if new_quantity <= 0:
            cart_item.delete()
            cart.refresh_from_db()
            serializer = CartSerializer(cart)
            return Response({'message': 'Cart item removed due to zero quantity', 'cart': serializer.data}, status=status.HTTP_200_OK)
        else:
            cart_item.quantity = new_quantity
            cart_item.save()
            cart.refresh_from_db()
            serializer = CartSerializer(cart)
            return Response({'message': 'Cart item updated', 'cart': serializer.data}, status=status.HTTP_200_OK)

    except CartItem.DoesNotExist:
         return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error updating cart item: {e}")
        return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# --- View: Remove Cart Item (Updated with DRF) ---
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_cart_item(request, item_product_id):
    # REMOVE: from register_user.models import Product
    try:
        cart = get_object_or_404(Cart, user=request.user)
        # Query CartItem using the product CharField directly
        cart_item = get_object_or_404(CartItem, cart=cart, product=str(item_product_id))

        cart_item.delete()
        cart.refresh_from_db()
        serializer = CartSerializer(cart)
        return Response({'message': 'Cart item removed successfully', 'cart': serializer.data}, status=status.HTTP_200_OK)

    except CartItem.DoesNotExist:
         return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error removing cart item: {e}")
        return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
