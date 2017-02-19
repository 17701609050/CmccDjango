from django.conf.urls import *
from login import views
from login.models import User
from django.views.generic import DetailView, ListView

urlpatterns = patterns('',
         
        url(r'^$', 'login.views.Login', name='Login'),
        url(r'^index/$', 'login.views.index', name = 'index'),
         
        )