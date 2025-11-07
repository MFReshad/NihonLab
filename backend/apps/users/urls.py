from django.urls import path
from . import views

urlpatterns = [
    # Authentication endpoints
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('auth/google/', views.google_auth, name='google-auth'),
    
    # User profile
    path('profile/', views.profile, name='profile'),
]