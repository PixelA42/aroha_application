from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
# Remove csrf_exempt if using TokenAuthentication and DRF views
# from django.views.decorators.csrf import csrf_exempt 
# Remove login_required
# from django.contrib.auth.decorators import login_required 
import json
from .models import Cart, CartItem
from decimal import Decimal 
from .serializers import CartSerializer 

# Import DRF decorators and permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response # Use DRF Response
from rest_framework import status # Use DRF status codes

# --- add_to_cart view (Updated with DRF) ---
# @csrf_exempt # Not needed with DRF/TokenAuth usually
# @login_required # Replaced by DRF decorators
@api_view(['POST']) # Specify allowed method
@permission_classes([IsAuthenticated]) # Require authentication via DRF
def add_to_cart(request):
    # No need to check request.method == 'POST', @api_view handles it
    # No need for explicit request.user.is_authenticated check, permission_classes handles it
    try:
        # data = json.loads(request.body) # DRF provides request.data
        data = request.data
        product_id = data.get('product_id')
        product_name = data.get('product_name')
        unit_label = data.get('unit_label')
        quantity = int(data.get('quantity', 1))
        price = data.get('price')

        if not product_id or not product_name or not unit_label or price is None:
            # Use DRF Response and status
            return Response({'error': 'Missing product data'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            price_decimal = Decimal(price)
        except Exception:
             # Use DRF Response and status
             return Response({'error': 'Invalid price format'}, status=status.HTTP_400_BAD_REQUEST)

        cart, created = Cart.objects.get_or_create(user=request.user)
        product_variant_identifier = f"{product_id}_{unit_label}"

        cart_item, item_created = CartItem.objects.get_or_create(
            cart=cart,
            product=product_variant_identifier,
            defaults={'quantity': quantity, 'price': price_decimal, 'product_name': product_name, 'unit_label': unit_label}
        )

        if not item_created:
            cart_item.quantity += quantity
            cart_item.save()
            status_code = status.HTTP_200_OK
            message = 'Item quantity updated in cart'
        else:
            status_code = status.HTTP_201_CREATED
            message = 'Item added to cart'

        # Use DRF Response
        return Response({
            'message': message,
            'cart_item': { # Consider using CartItemSerializer here for consistency
                'product': cart_item.product,
                'product_name': cart_item.product_name,
                'unit_label': cart_item.unit_label,
                'quantity': cart_item.quantity,
                'price': str(cart_item.price)
            }
        }, status=status_code)

    # except json.JSONDecodeError: # Not needed if using request.data
    except Exception as e:
        print(f"Error adding to cart: {e}")
        # Use DRF Response and status
        return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    # No need for else block for method check

# --- View: Get Cart Details (Updated with DRF) ---
# @login_required # Replaced by DRF decorators
@api_view(['GET']) # Specify allowed method
@permission_classes([IsAuthenticated]) # Require authentication
def view_cart(request):
    # No need to check request.method == 'GET'
    try:
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart) 
        # Use DRF Response
        return Response(serializer.data) 
    except Exception as e:
        print(f"Error viewing cart: {e}")
        # Use DRF Response and status
        return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    # No need for else block for method check

# --- View: Update Cart Item Quantity (Updated with DRF) ---
# @csrf_exempt # Not needed
# @login_required # Replaced
@api_view(['PUT']) # Specify allowed method
@permission_classes([IsAuthenticated]) # Require authentication
def update_cart_item(request, item_product_id): 
    # No need to check request.method == 'PUT'
    try:
        # data = json.loads(request.body) # Use request.data
        data = request.data
        new_quantity = int(data.get('quantity'))

        if new_quantity <= 0:
            # If quantity is 0 or less, remove the item
            # Duplicate removal logic here for simplicity
             cart = get_object_or_404(Cart, user=request.user)
             cart_item = get_object_or_404(CartItem, cart=cart, product=item_product_id)
             cart_item.delete()
             # Recalculate cart totals after deletion
             cart.refresh_from_db() # Ensure cart object reflects the deletion
             serializer = CartSerializer(cart)
             return Response({'message': 'Cart item removed due to zero quantity', 'cart': serializer.data}, status=status.HTTP_200_OK)


        cart = get_object_or_404(Cart, user=request.user)
        cart_item = get_object_or_404(CartItem, cart=cart, product=item_product_id) 

        cart_item.quantity = new_quantity
        cart_item.save()
        
        # Recalculate cart totals after update
        cart.refresh_from_db() # Ensure cart object reflects the update
        serializer = CartSerializer(cart)
        # Use DRF Response
        return Response({'message': 'Cart item updated', 'cart': serializer.data}, status=status.HTTP_200_OK)

    except CartItem.DoesNotExist:
         # Use DRF Response and status
         return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)
    # except json.JSONDecodeError: # Not needed
    #     return Response({'error': 'Invalid JSON'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(f"Error updating cart item: {e}")
        # Use DRF Response and status
        return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    # No need for else block for method check


# --- View: Remove Cart Item (Updated with DRF) ---
# @csrf_exempt # Not needed
# @login_required # Replaced
@api_view(['DELETE']) # Specify allowed method
@permission_classes([IsAuthenticated]) # Require authentication
def remove_cart_item(request, item_product_id): 
    # No need for is_internal_call or method check
    try:
        cart = get_object_or_404(Cart, user=request.user)
        cart_item = get_object_or_404(CartItem, cart=cart, product=item_product_id) 
        
        cart_item.delete()
        
        # Recalculate cart totals after deletion
        cart.refresh_from_db() # Ensure cart object reflects the deletion
        serializer = CartSerializer(cart)
        # Use DRF Response
        return Response({'message': 'Cart item removed successfully', 'cart': serializer.data}, status=status.HTTP_200_OK)

    except CartItem.DoesNotExist:
         # Use DRF Response and status
         return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error removing cart item: {e}")
        # Use DRF Response and status
        return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    # No need for else block for method check
