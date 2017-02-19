from django.conf.urls import *
from project import views
from login.models import User
from django.views.generic import DetailView, ListView

urlpatterns = patterns('',
         
#        url(r'^$', 'login.views.Login', name='Login'),
        url(r'^home/$', views.index, name='home'),
        url(r'^get_chip_name/$', 'project.views.get_chip_name', name='get_chip_name'),
        url(r'^queryPersonByChip/(.+)', 'project.views.queryPersonByChip', name='queryPersonByChip'),
        url(r'^createProject/$', 'project.views.createProject', name='createProject'),
        )