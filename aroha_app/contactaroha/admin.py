from django.contrib import admin
from .models import Subscription  # Correctly import the Subscription model

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('email', 'created_at')  # Ensure the field names match the Subscription model

