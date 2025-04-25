from django.urls import include

urlpatterns += [
    path('', include('register_user.urls')),
]