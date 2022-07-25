"""MuslimLife URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.urls import include
from rest_framework.documentation import include_docs_urls
from rest_framework.routers import SimpleRouter, DefaultRouter

from socializer.v1.views import DisputesViewSet
from superusers.v1.views import SuperuserViewSet
from users.v1.views import UserViewSet

router = SimpleRouter()

router.register(r'users', UserViewSet, basename='users')
router.register(r'superusers', SuperuserViewSet, basename='superusers')
router.register(r'disputes', DisputesViewSet, basename='disputes')

urlpatterns = [
    # router
    # url(r'^$', PingPongView.as_view()),
    url(r'^', include(router.urls, )),
]
