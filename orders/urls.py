from django.urls import path, re_path
from django.views.decorators.cache import cache_page

from .views import *

app_name = 'orders'

urlpatterns = [
    path('create-order/', create_order, name = 'create_order'),

]