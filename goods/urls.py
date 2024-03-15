from django.urls import path
from goods.views import *

app_name = 'goods'

urlpatterns = [
    path('', MainPage.as_view(), name='main')
]