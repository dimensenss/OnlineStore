from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import path, include, re_path

import users.views
from OnlineStore import settings
from goods.utils import BrandsAutocomplete, CategoryAutocomplete
from goods.views import page_not_found

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('goods.urls', namespace='goods')),
    path('user/', include('users.urls', namespace='user')),
    path('cart/', include('carts.urls', namespace='carts')),
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