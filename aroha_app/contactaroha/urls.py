from django.urls import path
from .views import ContactMessageView, SubscriberView

urlpatterns = [
    path('contact/', ContactMessageView.as_view(), name='contact_message'),
    path('subscribe/', SubscriberView.as_view(), name='subscribe'),
]
