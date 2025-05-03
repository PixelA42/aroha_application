from django.urls import path
from .views import SignUpView, SignInView, homepage_view, UserDetailView

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('signin/', SignInView.as_view(), name='signin'),
    path('user/', UserDetailView.as_view(), name='user-detail'),
    path('', homepage_view, name='homepage'),
]
