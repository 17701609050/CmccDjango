from django.conf.urls import *
from polls import views
from polls.models import Poll
from django.views.generic import DetailView, ListView
#urlpatterns = patterns('',
#            # ex: /polls/
#            url(r'^$', views.index, name='index'),
#            # ex: /polls/5/
#            url(r'^(?P<poll_id>\d+)/$', views.detail, name='detail'),
#            # ex: /polls/5/results/
#            url(r'^(?P<poll_id>\d+)/results/$', views.results, name='results'),
#            # ex: /polls/5/vote/
#            url(r'^(?P<poll_id>\d+)/vote/$', views.vote, name='vote'),
#       )

urlpatterns = patterns('',
        url(r'^$',
            ListView.as_view(
            queryset=Poll.objects.order_by('-pub_date')[:5],
            context_object_name='latest_poll_list',
            template_name='polls/index.html'),
            name='index'),
        url(r'^(?P<pk>\d+)/$',
            DetailView.as_view(
            model=Poll,
            template_name='polls/detail.html'),
            name='detail'),
        url(r'^(?P<pk>\d+)/results/$',
            DetailView.as_view(
            model=Poll,
            template_name='polls/results.html'),
            name='results'),
        url(r'^(?P<poll_id>\d+)/vote/$', 'polls.views.vote', name='vote'),
        url(r'^uploadFile/$', 'polls.views.upload_file', name='upload_file'),
        url(r'^download_csv/$', 'polls.views.download_csv', name='download_csv'),
        url(r'^download_pdf/$', 'polls.views.download_pdf', name='download_pdf'),
        )