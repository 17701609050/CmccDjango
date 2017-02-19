# -*- coding: utf-8 -*-
import MySQLdb
import json
import time
import datetime

class DbConnection(object):     
    def __init__(self, arg):
        """本类用于管理数据库连接"""
        self.arg = arg
    @classmethod
    def get_connection_bugzilla(self,db_name='bugs'):    
        _t = dict(host = '10.0.19.130',user = 'bugs2',passwd = '12abAB', db=db_name)   
        return MySQLdb.connect(host = _t["host"], user = _t["user"], passwd = _t["passwd"], db=_t["db"],\
            connect_timeout=10,charset='utf8', init_command='SET NAMES UTF8')  

   
    @classmethod
    def get_connection_cmcc(self,db_name = 'cmcc' ):
        # _t = config.connection_55
        return MySQLdb.connect(host ="10.0.3.55", user = "iQuser", passwd = "IQ$User55%", db="issue_tracking",\
            connect_timeout=10,charset='utf8', init_command='SET NAMES UTF8')
        
    @classmethod
    def get_connection_175_imanage(self,db_name = 'imanage' ):
        _t = dict(host = '10.0.0.175',user = 'iadmin',passwd = 'itask#ADMIN89', db=db_name)
        return MySQLdb.connect(host = _t["host"], user = _t["user"], passwd = _t["passwd"], db=_t["db"], connect_timeout=10,charset='utf8', init_command='SET NAMES UTF8')