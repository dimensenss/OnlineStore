from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import path, include

import users.views
from OnlineStore import settings
from goods.views import page_not_found

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('goods.urls', namespace='goods')),
    path('user/', include('users.urls', namespace='user')),
    path('accounts/', include('allauth.urls')),

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