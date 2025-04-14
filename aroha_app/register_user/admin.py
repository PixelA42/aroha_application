from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'is_active')  # Display email, name, and active status in admin panel
    list_filter = ('is_active',)  # Add filter for active status
    search_fields = ('email', 'name')  # Add search functionality for email and name

# Register your models here.
