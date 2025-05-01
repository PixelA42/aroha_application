from django.urls import path
from .views import ProductReviewList, ReviewCreate

app_name = 'review'

urlpatterns = [
    # URL to list reviews for a specific product
    path('product/<str:product_identifier>/', ProductReviewList.as_view(), name='product-review-list'),
    # URL to create a new review
    path('create/', ReviewCreate.as_view(), name='review-create'),
]
