from django.urls import path, re_path
from django.views.decorators.cache import cache_page
from .views import *


app_name = 'carts'

urlpatterns = [
    path('cart_add/', cart_add, name='cart_add'),
    path('cart_change/', cart_change, name='cart_change'),
    path('cart_remove/', cart_remove, name='cart_remove'),
]