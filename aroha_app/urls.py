from django.urls import path, include

urlpatterns = [
    path('', include('register_user.urls')),
]