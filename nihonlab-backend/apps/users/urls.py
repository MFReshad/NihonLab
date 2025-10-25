from django.urls import path
from . import views

urlpatterns = [
    # path('register/', views.register, name='register'),
    # path('login/', views.login, name='login'),
    # path('profile/', views.profile, name='profile'),
    # path('stats/', views.user_stats, name='user-stats'),
    path('', views.Home, name='home'),
]