from django.urls import path
from users.views import signup_redirect
from goods.views import *

app_name = 'goods'

urlpatterns = [
    path('', MainPage.as_view(), name='main'),
    path('accounts/social/signup/', signup_redirect, name='signup_redirect'),
]