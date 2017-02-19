from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import TemplateDoesNotExist, RequestContext
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import *
from django.contrib.auth.decorators import login_required 
# from django.core.context_processors import csrf
from django.core.urlresolvers import reverse
from django.core import serializers
import ldap
import json
from learn import models

@login_required
def index(request): 
    # if request.user.is_authenticated():
     
    return render(request, 'home.html', {'uname': request.user})
    # else:
    #     return HttpResponseRedirect('/login?next=/home/')


@login_required
def get_chip_name(request): 
    chipdata = models.CmccProjectChip.objects.values("chip_name")
    print chipdata
    chhiplist = []
    for chip in chipdata:
        chhiplist.append(chip['chip_name'])
    print 'chhiplist', chhiplist
    json_data = json.dumps({"status":200, "data":chhiplist, "message":""})
    return HttpResponse(json_data, content_type="application/json")


def queryPersonByChip(request, chipname):

    result = models.CmccProjectChip.objects.get(chip_name=chipname)
    result_data = []
    result_data.append(result.toJSON())
    json_data = json.dumps({"state":200, "data":result_data, "message":""})
    return HttpResponse(json_data, content_type="application/json")

@login_required
def createProject(request):

    if request.method == 'POST':
        data = json.loads(request.POST.get('data').encode('utf-8'))
        print data
        projectdata = models.CmccProject.json_to_cmcc_project(data)
        projectStakeholdersData = models.CmccProjectStakeholders.json_to_cmcc_projectStakeholders(data)
        project = models.CmccProject(**projectdata) 
        project.save()
        
        projectStakeholdersData.update({"project_id":project.project_id})
        stakeholders = models.CmccProjectStakeholders(**projectStakeholdersData)
        stakeholders.save()

        json_data = json.dumps({"state":200, "data":project.project_id, "message":""})
        return HttpResponse(json_data, content_type="application/json")