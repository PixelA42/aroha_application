from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product_identifier', 'reviewer_name', 'rating', 'created_at', 'user')
    list_filter = ('rating', 'created_at')
    search_fields = ('product_identifier', 'reviewer_name', 'text', 'user__username')
    readonly_fields = ('created_at',)
