#coding=utf-8
from django.shortcuts import render, render_to_response, redirect
from django.http import HttpResponseRedirect
from login.models import User
from django import forms as form_view
from django.contrib.auth import *
from django.contrib.auth.forms import (
    AuthenticationForm, PasswordChangeForm, PasswordResetForm, SetPasswordForm,
)

#定义表单模型
class UserForm(form_view.Form):
    username = form_view.CharField(label='用户名：', max_length=100)
    password = form_view.CharField(label='密码：', widget=form_view.PasswordInput())

 
#登录
def Login(request):
    next = None
    if request.GET.get('next'):
        next = request.META['QUERY_STRING'].split('next=')[1].split("&type=qq")[0]
    if request.method == 'POST': 
         
        username = request.POST.get('username')
        password = request.POST.get('p') 
         
        user = authenticate(username=username, password=password)

        if user is not None:
            if user.is_active:
                login(request, user)
                response = HttpResponseRedirect('/home')
                if next:
                    return redirect(next)
                    
                return response

        return render(request, 'user_login.html',{'message':'请填写正确的账号和密码!'})
    else: #get请求
        return render(request, 'user_login.html',{'message':''})