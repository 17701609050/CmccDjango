#coding:utf-8
from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import TemplateDoesNotExist, RequestContext
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import *
# from django.core.context_processors import csrf
from django.core.urlresolvers import reverse
from django.core import serializers
import ldap
import json
import models
from cmcc_dao import CMCCProjectDao
cmcc = CMCCProjectDao()

def index(request): 
    if request.user.is_authenticated():
     
        return render(request, 'home.html', {'uname': request.user})
    else:
        return HttpResponseRedirect('/login?next=/home/')
        
#@ensure_csrf_cookie
#def login(request):
#    # c = {}
#    # c.update(csrf(request))
#    if request.method == 'GET':
#        sessionid = request.session.get('username', '')
#        if sessionid:
#            # c.update({'uname':sessionid})
#            return render_to_response("home.html", request)
#        return render_to_response("login.html", request)
#    elif request.method == 'POST':
#        # print 'login post '
#        return render(request, 'login.html')

def enterWareHouse(request):
    sessionid = request.session.get('username', '')
    project_id = request.GET.get('project_id', '')
    print project_id
    if sessionid:
        return render(request, 'enterWareHouse.html', {'uname': sessionid, "project_id":project_id})
    else:
        return render_to_response("login.html", {}, RequestContext(request))
    # web_url = 'enterWareHouse.html'
    # count_page_time(web_url)
    # sid = request.cookies.get('sid')
    # project_id = request.args.get('project_id','')

    # if '_id' in session:
    #     resp = set_response('enterWareHouse.html', project_id)
    #     return resp

    # if not sid:
    #     return redirect('/login#*redirecturl*=enterHouse?project_id='+project_id)
    
    # result = userservice.get_session(sid)
    # if result:
    #     result_session = session_add(result)
    #     return render_template("enterWareHouse.html", project_id=project_id, checkShouldRefreshJs = checkShouldRefreshJs() ,uname = result)

    # return redirect('/login#*redirecturl*=enterHouse?project_id='+project_id)

# def add(request):
#     a = request.GET.get('a', 0)
#     b = request.GET.get('b', 10)
#     c = int(a)+int(b)
#     return HttpResponse(str(c))

# def add2(request, a, b):
#     c = int(a) + int(b)
#     print 'c is %s', c
#     return HttpResponse(str(c))

# def old_add2_redirect(request, a, b):
#     print a
#     return HttpResponseRedirect(
#         reverse('add2', args=(a, b))
#     )

@ensure_csrf_cookie
def user_login(request):
    if request.method == 'GET':
        
        return render_to_response("login.html", {}, RequestContext(request))
    else:
        print 'login post '
        response = HttpResponse()
        print request.POST.get('name')
        name = request.POST.get('name')
        pw = request.POST.get('pw')
        request.session['username'] = name
        print login_validate(name, pw)
        # assert login_validate == True
        if login_validate(name, pw):
            json_data = json.dumps({"status":200,"data":"","message":"login success!"})
            return HttpResponse(json_data, content_type="application/json")
        else:
            return json.dumps({"status":500,"data":"","message":"username or password error"})

def Logout(request):
    if request.method == 'GET': 
#        response = HttpResponse('logout !!')
        logout(request)
         
        json_data = json.dumps({"status":200,"data":"","message":"logout success!"})
        return HttpResponse(json_data, content_type="application/json") 
        # else:
        #     json_data = json.dumps({"status":200,"data":"","message":"logout fail!"})
def get_project_basic_question(request, project_id):
    ''' 获取项目详情 '''
    #project_id = request.GET.get('project_id',"")

    print 'project_id is %s', project_id
    result = dict(state=200, data="", message="")    
    result_data = cmcc.getproject_basic_info_byid(project_id)
    result['data'] = result_data
    json_data = json.dumps(result)
    return HttpResponse(json_data, content_type="application/json") 

def get_chip_name(request):
    chipdata = models.CmccProjectChip.objects.values("chip_name")
    print chipdata
    print request.session.get('username', False)
    chhiplist = []
    for chip in chipdata:
        chhiplist.append(chip['chip_name'])
    
    json_data = json.dumps({"status":200,"data":chhiplist,"message":"login success!"})
    return HttpResponse(json_data, content_type="application/json")


def get_project_name(request, status):
    ''' 获取客户名 '''
    print status
    search_data = {
                    'chip_name':request.GET.get('chip_name',""),
                    'cust_name':request.GET.get('q',""),
                    'project_status':status,
                    'limit':request.GET.get('limit',"10"),
                    'submiter':request.session['username']
                    }
    print search_data
    result_data = cmcc.get_project_name(search_data)
    json_data = json.dumps({"status":200,"data":result_data,"message":"ok!"})
    return HttpResponse(json_data, content_type="application/json")



def cmcc_project_gethome_project_info(request):
    
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
                    'submiter': request.session['username']
                    }
    result_data,total = cmcc.get_my_project(search_data)
    project_result = {}
    project_result['rows'] = result_data
    project_result['total'] = total
    result['data'] = project_result
    # print project_result
    return HttpResponse(json.dumps(project_result), content_type="application/json")#json.dumps(result['data'])

def getproject_basic_info_by_all(request):
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
                    'submiter': request.session['username']
                    }
    search_data['project_status'] = search_data['project_status'].split(',')
    result_data,total = cmcc.get_all_project(search_data)
    all_result = {}
    all_result['rows'] = result_data
    all_result['total'] = total
    result['data'] = all_result
    return HttpResponse(json.dumps(result['data']), content_type="application/json")    

def login_validate(username,password):
    # try:

    # if config.current_env != config.INTERNAL:
    username += "@spreadtrum.com"
    # else:
    #     username += "@sprd.com"

    con = ldap.initialize("ldap://spreadtrum.com")
    con.set_option(ldap.OPT_REFERRALS, 0)
    con.simple_bind_s(username,password)
    return True


def issues(request):
    '''获取问题列表'''
    results = {}
    search_data = {'project_id':request.GET.get('project_id', ''),
                   'pageIndex':request.GET.get('pageIndex', "0"),
                   'pageSize':request.GET.get('pageSize', "10"),
                   'to_solve_the_problem_rounds':request.GET.get\
                   ('to_solve_the_problem_rounds', ''),
                   'question_status':request.GET.get('question_status', ''),
                   'difference_meeting':request.GET.get('difference_meeting', ''),
                   'group':request.GET.get('groups', ""),
                   'action':request.GET.get('action', ''),
                   'model_name':request.GET.get('model_name', ''),
                   'question_num':request.GET.get('question_num', '')
                  }
    data, total = QuestionsList.get_questions(search_data)
    same_date_bugs = QuestionsList.query_whether_the_same(search_data)
    if same_date_bugs:
        results = {'data':data, 'total':total, 'message':"一个问题编号包含多个相同的bugs", \
        'error_data':same_date_bugs}
    else:
        results = {'data':data, 'total':total, 'message':"", 'error_data':""}

    return json.dumps(results)