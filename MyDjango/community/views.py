#coding:utf-8
from django.shortcuts import render
from django.shortcuts import render_to_response, redirect
from django.template import RequestContext, Context, loader
from forum.forms.user import RegisterForm, LoginForm, ForgotPasswordForm, SettingPasswordForm, SettingForm
from common import sendmail
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect

def resgister(request):

    return render(request, 'community/resgister.html', {})



def post_resgister(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect(reverse('/'))
    state = None
    # if request.method == 'POST':
    password = request.POST.get('password', '')
    repeat_password = request.POST.get('repeat_password', '')
    if password == '' or repeat_password == '':
        state = 'password is not empty'
    elif password != repeat_password:
        state = 'password repeat_error'
    else:
        username = request.POST.get('username', '')
        if User.objects.filter(username=username):
            state = 'user_exist'
        else:
            new_user = User.objects.create_user(username=username, password=password,
                                                email=request.POST.get('email', ''))
            new_user.save()
            new_my_user = MyUser(user=new_user, nickname=request.POST.get('nickname', ''))
            new_my_user.save()
            state = 'success'

    return redirect(settings.LOGIN_URL)
# Create your views here.
