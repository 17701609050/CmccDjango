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
from learn.models import CmccProject, CmccProjectStakeholders, CmccProjectChip

@login_required
def index(request):
    return render(request, 'home.html', {'uname': request.user})

@login_required
def get_chip_name(request): 
    chipdata = CmccProjectChip.objects.values("chip_name")

    chhiplist = []
    for chip in chipdata:
        chhiplist.append(chip['chip_name'])
    print 'chhiplist', chhiplist
    json_data = json.dumps({"status":200, "data":chhiplist, "message":""})
    return HttpResponse(json_data, content_type="application/json")


def queryPersonByChip(request, chipname):

    result = CmccProjectChip.objects.get(chip_name=chipname)
    result_data = []
    result_data.append(result.toJSON())
    json_data = json.dumps({"state":200, "data":result_data, "message":""})
    return HttpResponse(json_data, content_type="application/json")

@login_required
def createProject(request):

    if request.method == 'POST':
        data = json.loads(request.POST.get('data').encode('utf-8'))
        print data
        projectdata = CmccProject.json_to_cmcc_project(data)
        projectStakeholdersData = CmccProjectStakeholders.json_to_cmcc_projectStakeholders(data)
        project = CmccProject(**projectdata)
        project.save()
        print project.project_id
        projectStakeholdersData.update({"project_id":project.project_id})
        stakeholders = CmccProjectStakeholders(**projectStakeholdersData)
        stakeholders.save()

        json_data = json.dumps({"state":200, "data":project.project_id, "message":""})
        return HttpResponse(json_data, content_type="application/json")

def projectsall(request):
    result = dict(state=200, data="", message="")
    print request.session['_auth_user_id']
    search_data = {
                    'cust_name':request.GET.get('cust_name', ""),
                    'chip_name':request.GET.get('chip_name', ""),
                    'project_status':request.GET.get('status', ""),
                    'offset':request.GET.get('offset', 0),
                    'limit':request.GET.get('limit', 10),
                    'test_round':request.GET.get('test_round', ""),
                    'passed_round':request.GET.get('passed_round', ""),
                    'send_test_type':request.GET.get('send_test_type', ""),
                    'submiter': request.session['_auth_user_id']
                    }
    search_data['project_status'] = search_data['project_status'].split(',')

    result_data, total = CmccProject.get_all_project(search_data)
    all_result = {}
    all_result['rows'] = result_data
    all_result['total'] = total
    result['data'] = all_result

    return HttpResponse(json.dumps(result['data']), content_type="application/json")

def get_data_by_status(request):
    result = dict(state=200, data="", message="")
    search_data = {
                    'cust_name':request.GET.get('cust_name', ""),
                    'chip_name':request.GET.get('chip_name', ""),
                    'project_status':request.GET.get('status', ""),
                    'offset':request.GET.get('offset', 0),
                    'limit':request.GET.get('limit', 10),
                    'test_round':request.GET.get('test_round', ""),
                    'passed_round':request.GET.get('passed_round', ""),
                    'send_test_type':request.GET.get('send_test_type', ""),
                    'submiter': request.session['_auth_user_id']
                    }

    result_data,total = CmccProject.get_all_project(search_data)
    project_result = {}
    project_result['rows'] = result_data
    project_result['total'] = total
    result['data'] = project_result
    # print project_result
    return HttpResponse(json.dumps(project_result), content_type="application/json")#json.dumps(result

def enterWareHouse(request):
    project_id = request.GET.get('project_id', '')
    print project_id
     
    return render(request, 'enterWareHouse.html', {"project_id": project_id})

def get_project_basic_question(request, project_id):

    result = dict(state=200, data={}, message="")

    result_dic2 = None
    result_data = CmccProject.objects.filter(project_id=project_id)

    projectstakeholder = []
    if result_data:
        projectstakeholder = result_data[0].cmccprojectstakeholders_set.all()

    if projectstakeholder:
        result_dic2 = projectstakeholder[0].toJSON()
        result_dic2['project'] = json.loads(result_dic2['project'].toJSON())

    result['data'] = result_dic2
    json_data = json.dumps(result)
    return HttpResponse(json_data, content_type="application/json")

def issues(request):
    # if request.method == 'POST':
    project_id = request.POST.get('project_id', '')
    print 'project_id', project_id
    result = dict(state=200, data={}, message="")
    json_data = json.dumps(result)
    return HttpResponse(json_data, content_type="application/json")
