#coding=utf-8 

from django.shortcuts import render_to_response 
from django.template import RequestContext 

def index(request): 
    return render_to_response('nav.html', {}, RequestContext(request)) 