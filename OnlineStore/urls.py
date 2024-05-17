from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import path, include, re_path

import users.views
from OnlineStore import settings
from goods.utils import BrandsAutocomplete, CategoryAutocomplete, ProductsAutocomplete, AttributeNameAutocomplete, AttributeValueAutocomplete
from goods.views import page_not_found

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('goods.urls', namespace='goods')),
    path('user/', include('users.urls', namespace='user')),
    path('cart/', include('carts.urls', namespace='carts')),
    path('orders/', include('orders.urls', namespace='orders')),

    path('accounts/', include('allauth.urls')),

    re_path(
        r'^brands-autocomplete/$',
        BrandsAutocomplete.as_view(),
        name='brands-autocomplete',
    ),
    re_path(
        r'^category-autocomplete/$',
        CategoryAutocomplete.as_view(),
        name='category-autocomplete',
    ),
    re_path(
        r'^products-autocomplete/$',
        ProductsAutocomplete.as_view(),
        name='products-autocomplete',
    ),
    re_path(
        r'^attribute-name-autocomplete/$',
        AttributeNameAutocomplete.as_view(),
        name='attribute-name-autocomplete',
    ),
    re_path(
        r'^attribute-value-autocomplete/$',
        AttributeValueAutocomplete.as_view(),
        name='attribute-value-autocomplete',
    ),
    path('ckeditor/', include('ckeditor_uploader.urls')),

]


if settings.DEBUG:
    import debug_toolbar

    urlpatterns = [
        path("__debug__/", include(debug_toolbar.urls)),
    ] + urlpatterns
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

else:
    urlpatterns += staticfiles_urlpatterns()



handler404 = page_not_found