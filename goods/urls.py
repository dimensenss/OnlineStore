from django.urls import path, re_path
from users.views import signup_redirect, profile_redirect
from goods.views import *

app_name = 'goods'

urlpatterns = [
    path('', MainPage.as_view(), name='main'),
    path('product/<slug:product_slug>/', ProductView.as_view(), name='product'),
    re_path(r'^catalog/(?P<cat_slug>[-\w/]+)/$', CatalogPage.as_view(), name='catalog'),
    path('search/', SearchPage.as_view(), name='search'),
    path('remove_review/', remove_review, name='remove_review'),

    # redirect social auth
    path('accounts/social/signup/', signup_redirect, name='signup_redirect'),
    path('accounts/profile/', profile_redirect, name='profile_redirect'),
]