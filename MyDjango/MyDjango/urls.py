#coding:utf-8
"""test_project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import *
from django.contrib import admin
from django.contrib.staticfiles import views as static_views
from learn import views
from django.conf import settings


urlpatterns = patterns('',
    # url(r'^home/$', views.index, name='home'),
    # url(r'^login/$', views.login, name='login'),
    # url(r'^user_login/', views.user_login, name='user_login'),
    # url(r'^logout/', views.logout, name='logout'),
    # url(r'^project/get_chip_name/', views.get_chip_name, name='get_chip_name'),
    # url(r'^projects/status', views.cmcc_project_gethome_project_info, name='cmcc_project_gethome_project_info'),
    # url(r'^projects/all', views.getproject_basic_info_by_all, name='getproject_basic_info_by_all'),
    # # url(r'^accounts/', include('users.urls')),
    # url(r'^add/(\d+)/(\d+)/$', views.old_add2_redirect), # 注意修改了这一行
    # url(r'^new_add/(\d+)/(\d+)/$', views.add2, name='add2'),
    # url(r'^admin/', include(admin.site.urls)),
    
    url(r'^$', views.index, name='index'),
    
#    url(r'^login/$', views.login, name='login'),
    url(r'^user_login/', views.user_login, name='user_login'),
    # url(r'^logout/', views.Logout, name='logout'),
#    url(r'^project/get_chip_name/', views.get_chip_name, name='get_chip_name'),
#     url(r'^enterHouse/', views.enterWareHouse, name='enterWareHouse'),
#     url(r'^issues/', views.issues, name='issues'),

    # url(r'^project/get_project_basic_question/(.+)/', views.get_project_basic_question, name='get_project_basic_question'),
    url(r'^project/get_project_name/(.+)/', views.get_project_name, name='get_project_name'),
    # url(r'^projects/status', views.cmcc_project_gethome_project_info, name='cmcc_project_gethome_project_info'),
    # url(r'^projects/all', views.getproject_basic_info_by_all, name='getproject_basic_info_by_all'),
    # url(r'^accounts/', include('users.urls')),
    # url(r'^add/(\d+)/(\d+)/$', views.old_add2_redirect), # 注意修改了这一行
    # url(r'^new_add/(\d+)/(\d+)/$', views.add2, name='add2'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^polls/', include('polls.urls', namespace="polls")),
    url(r'^login/', include('login.urls', namespace="login")),
    url(r'^project/', include('project.urls', namespace='project')),
    url(r'', include('webuser.urls')),
    url(r'', include('movie.urls')),
    url(r'', include('project.urls')),
    url(r'', include('library.urls')),
    url(r'', include('community.urls')),

)

if settings.DEBUG:
    urlpatterns += [
        # url(r'^static/(?P<path>.*)$', static_views.static.serve, {'document_root': settings.STATIC_ROOT}, name="static"),
        url(r'^uploads/(?P<path>.*)$', static_views.static.serve, {'document_root': settings.MEDIA_ROOT}, name="uploads")
    ]
