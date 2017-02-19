# -*- coding: utf-8 -*-
'''数据库连接信息'''
import MySQLdb

class DbConnection(object):
    """本类用于管理数据库连接"""
    def __init__(self, arg):
        self.arg = arg
    @classmethod
    def get_connection_bugzilla(cls, db_name='bugs'):
        """管理bugzilla数据库连接"""
        _t = dict(host='10.0.19.130', user='bugs2', passwd='12abAB', db=db_name)   
        return MySQLdb.connect(host = _t["host"], user = _t["user"], passwd = _t["passwd"], \
            db=_t["db"], connect_timeout=10,charset='utf8', init_command='SET NAMES UTF8')

    @classmethod
    def get_connection_local_cmcc(cls, db_name = 'cmcc' ):
        """管理local_cmcc数据库连接"""
        _t = dict(host='10.1.151.91', user='root', passwd='123456', db=db_name)
        return MySQLdb.connect(host=_t["host"], user=_t["user"], passwd=_t["passwd"], \
            db=_t["db"], connect_timeout=10,charset='utf8', init_command='SET NAMES UTF8')

    @classmethod
    def get_connection_55(cls, db_name='issue_tracking' ):
        """管理55数据库连接"""
        _t = dict(host='10.0.3.55', user='iQuser',passwd='IQ$User55%', db=db_name)
        return MySQLdb.connect(host=_t["host"], user=_t["user"], passwd=_t["passwd"], \
            db=_t["db"], connect_timeout=10, charset='utf8', init_command='SET NAMES UTF8')
