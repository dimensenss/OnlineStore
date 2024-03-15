from django.urls import path
from goods.views import *

app_name = 'goods'

urlpatterns = [
    path('', main_page, name='main')
]