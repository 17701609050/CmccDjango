#coding:utf-8
from django.conf.urls import *
import common
import views as view

urlpatterns = patterns('',

    url(r'^community/resgister', common.method_splitter, {'GET': view.resgister, 'POST': view.post_resgister}),

)
