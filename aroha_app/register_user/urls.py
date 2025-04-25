from django.urls import path
from .views import SignUpView, SignInView, homepage_view

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('signin/', SignInView.as_view(), name='signin'),
    path('', homepage_view, name='homepage'),
]
