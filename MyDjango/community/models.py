#coding:utf-8
from django.db import models
from django.contrib.auth.models import User

class ForumUser(models.Model):

    '''
    django.contrib.auth.models.User 默认User类字段太少，用AbstractUser
    自定义一个User类，增加字段
    '''
    nickname = models.CharField(max_length=200, null=True, blank=True)
    avatar = models.CharField(max_length=200, null=True, blank=True)    # 头像
    signature = models.CharField(max_length=500, null=True, blank=True) # 签名
    location = models.CharField(max_length=200, null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    company = models.CharField(max_length=200, null=True, blank=True)
    role = models.IntegerField(null=True, blank=True)                   # 角色
    balance = models.IntegerField(null=True, blank=True)                # 余额
    reputation = models.IntegerField(null=True, blank=True)             # 声誉
    self_intro = models.CharField(max_length=500, null=True, blank=True)# 自我介绍
    updated = models.DateTimeField(null=True, blank=True)
    twitter = models.CharField(max_length=200, null=True, blank=True)
    github = models.CharField(max_length=200, null=True, blank=True)
    douban = models.CharField(max_length=200, null=True, blank=True)


# Create your models here.
