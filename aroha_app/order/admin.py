from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0 # Don't show extra blank forms
    readonly_fields = ('product_identifier', 'product_name', 'unit_label', 'quantity', 'price', 'total_item_price') # Make items read-only in admin
    can_delete = False # Prevent deleting items from order via admin inline

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at', 'total_amount', 'payment_method', 'status')
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('id', 'user__username', 'user__email')
    readonly_fields = ('user', 'created_at', 'total_amount') # Fields that shouldn't be edited directly
    inlines = [OrderItemInline]

# Optionally register OrderItem if you want a separate admin view for it
# @admin.register(OrderItem)
# class OrderItemAdmin(admin.ModelAdmin):
#     list_display = ('order', 'product_name', 'quantity', 'price', 'total_item_price')
#     search_fields = ('order__id', 'product_name')
