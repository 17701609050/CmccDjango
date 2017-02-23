from django.conf.urls import *
# from project import views
from login.models import User
from django.views.generic import DetailView, ListView

urlpatterns = patterns('',

#        url(r'^$', 'login.views.Login', name='Login'),
        url(r'^library', 'library.views.library', name='homepage'),
        url(r'^add_book', 'library.views.add_book', name='add_book'),
        url(r'^add_img', 'library.views.add_img', name='add_img'),
        url(r'^view_book_list', 'library.views.view_book_list', name='view_book_list'),
        url(r'^signup', 'library.views.signup', name='signup'),
        url(r'^login', 'library.views.login', name='login'),
        url(r'^set_password', 'library.views.set_password', name='set_password'),
        url(r'^logout', 'library.views.logout', name='logout'),
        url(r'^bookdetail/', 'library.views.bookdetail', name='bookdetail'),
        )
