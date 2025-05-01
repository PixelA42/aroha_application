from django.urls import path
# Import the function-based views
from .views import add_to_cart, view_cart, update_cart_item, remove_cart_item

urlpatterns = [
    # Use function-based views
    path('', view_cart, name='view_cart'), # GET cart details
    path('add/', add_to_cart, name='add_to_cart'), # POST to add item
    # Use str:item_product_id to match the view function argument
    path('update/<str:item_product_id>/', update_cart_item, name='update_cart_item'), # PUT to update quantity
    path('remove/<str:item_product_id>/', remove_cart_item, name='remove_cart_item'), # DELETE to remove item
]