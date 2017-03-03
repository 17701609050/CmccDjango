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
        url(r'^projects/all/$', 'project.views.projectsall'),
        url(r'^projects/status/$', 'project.views.get_data_by_status', name='get_data_by_status'),
        url(r'^enterHouse/$', 'project.views.enterWareHouse', name='enterWareHouse'),
        url(r'^project/get_project_basic_question/(.+)', 'project.views.get_project_basic_question'),
        url(r'^issues/', 'project.views.issues'),
        url(r'^summaryproject/', 'project.views.summaryproject', name='summaryproject'),
        url(r'^ajaxproject/', 'project.views.ajaxproject', name='ajaxproject'),
        url(r"apply_update.html/search", 'project.views.apply_update_search', name='post_order_id'),
        url(r"apply_music", 'project.views.apply_music', name='apply_music')
        )