#-*- coding:utf-8 -*-
''' 业务逻辑 '''
import json
import MySQLdb
import datetime
from django.core import serializers
from modify_project_status import DbConnection

from models import CmccProject

class CMCCProjectDao(object):
    '''  ProjectDao '''

    def get_my_project(self, search_data):
        '''  获取HOME页面我的项目 '''
        # print session.get('username', False)
        current_user = 'teng.gao'
        sql = '''select SQL_CALC_FOUND_ROWS t1.* from cmcc_project_basic_info t1 inner join cmcc_project_roles t2 on t1.project_id=t2.project_id '''
        sql += ''' where t1.project_status = %s ''' 
        sql +=  ''' and ( (%s in (select t2.CPM from cmcc_project_roles)) or (%s in (select t2.SW_TAM from cmcc_project_roles)) or 
                    (%s in (select t2.HW_TAM from cmcc_project_roles)) or (%s in (select t2.HW_RF from cmcc_project_roles)) or
                    (%s in (select t2.Audio_PL from cmcc_project_roles)) or (%s in (select t2.Power_PL from cmcc_project_roles)) or
                    (%s in (select t2.PM from cmcc_project_roles)) or (%s in (select t2.Ali_PM from cmcc_project_roles)) or
                    (%s in (select t2.PLD_PM from cmcc_project_roles)) or (%s in (select t2.CSD_PM from cmcc_project_roles)) or
                    (%s in (select t2.PHY_PL from cmcc_project_roles)) or (%s in (select t2.Test_PL from cmcc_project_roles)) or
                    (%s in (select t2.PICLAB_FO from cmcc_project_roles)) or (%s in (select t2.FT_FO from cmcc_project_roles))
                     ) '''

        if search_data['cust_name']:
            sql += ''' and t1.cust_name ="'''+ search_data['cust_name']+'''" ''' 

        if search_data['chip_name']:
            sql +=''' and t1.chip_name ="'''+search_data['chip_name']+'''" '''

        if search_data['test_round']:
            sql +=''' and t1.test_round_number = "'''+search_data['test_round']+'''" '''

        if search_data['passed_round']:
            sql +=''' and t1.passed_round_number = "'''+search_data['passed_round']+'''" '''

        if search_data['send_test_type']:
            sql +=''' and t1.send_test_type = "'''+search_data['send_test_type']+'''" '''

        if search_data['project_status'] == 'Plan':
            sql += ''' order by t1.plan_sendtest_time desc, t1.send_test_type asc, t1.cust_name desc '''

        if search_data['project_status'] == 'Testing':
            sql += ''' order by t1.test_round_number desc '''

        if search_data['project_status'] == 'Approving':
            sql += ''' order by t1.onmeeting_time asc '''

        if search_data['project_status'] == 'Pass':
            sql += ''' order by t1.passed_time desc '''

        sql += " limit %s offset %s "

        count_sql = 'select FOUND_ROWS() project_id'
        conn = DbConnection.get_connection_cmcc()
        cursor= conn.cursor(cursorclass=MySQLdb.cursors.DictCursor)
        cursor.execute(sql, (search_data['project_status'], current_user, current_user, current_user,\
            current_user, current_user, current_user, current_user, current_user, current_user,current_user,\
             current_user,current_user, current_user, current_user, int(search_data['limit']),int(search_data['offset'])))
        result = cursor.fetchall()
        cursor.execute(count_sql)
        # print sql
        
        count_result = cursor.fetchall()
        all_count = count_result[0]['project_id']
        cursor.close()
        conn.close()
        # current_user = current_user.upper()
        current_date = datetime.datetime.now()
        
        for res in result:
            if search_data['project_status'] == 'Approving' or search_data['project_status'] == 'Pass':
                if res['onmeeting_time']:
                    onmeeting_time = datetime.datetime.strptime(res['onmeeting_time'], '%Y-%m-%d')
                    res['onmeeting_days'] = (current_date-onmeeting_time).days
                    # res['remaining_question'] = self.get_num(res['project_id'], '', 'Remaining')

                if search_data['project_status'] == 'Pass':
                    if res['passed_time']:
                        passed_time = datetime.datetime.strptime(res['passed_time'], '%Y-%m-%d')
                        if res['v1_sendtest_time']:
                            v1_sendtest_time = datetime.datetime.strptime(res['v1_sendtest_time'], '%Y-%m-%d')
                            res['passed_days'] = (passed_time-v1_sendtest_time).days

                    if res['passed_time'] and res['v3_sendtest_time']:
                        res['passed_round_number'] = 'V3'

                    if res['passed_time'] and res['v2_sendtest_time'] and not res['v3_sendtest_time']:
                        res['passed_round_number'] = 'V2'

                    if res['passed_time'] and not res['v2_sendtest_time'] and not res['v3_sendtest_time']:
                        res['passed_round_number'] = 'V1'

            if search_data['project_status'] == 'Testing': 
                v1_sendtest_time = datetime.datetime.strptime(res['v1_sendtest_time'], '%Y-%m-%d')
                res['sendtested_days'] = (current_date-v1_sendtest_time).days

                if res['test_round_number'] == 'V1':
                    res['this_round_sendtest_time'] = res['v1_sendtest_time']

                if res['test_round_number'] == 'V2':
                    res['this_round_sendtest_time'] = res['v2_sendtest_time']

                if res['test_round_number'] == 'V3':
                    res['this_round_sendtest_time'] = res['v3_sendtest_time']

            if search_data['project_status'] == 'Plan':
                if res['plan_sendtest_time']:
                    plan_sendtest_time = datetime.datetime.strptime(res['plan_sendtest_time'], '%Y-%m-%d')
                    res['sendtested_days'] = (current_date-plan_sendtest_time).days

        total = all_count

        return result, total


    def get_all_project(self, search_data):
        print 'search_data',search_data
        # cp = CmccProject.objects.all()
        cp = serializers.serialize("json", CmccProject.objects.all())
        cp = json.loads(cp)
        count = CmccProject.objects.all().count()

        cmlist = []
        if cp:
            for c in cp:
                print c
                cmlist.append(c['fields'])
        
        return cmlist, count
        # total = que.count()
        '''  获取HOME页面全部项目   '''
        # session = SESSION()
        # que = session.query(CmccProject).order_by(desc(CmccProject.project_status=='Approving'))\
        #                                 .order_by(desc(CmccProject.project_status=='Testing'))\
        #                                 .order_by(desc(CmccProject.project_status=='Plan'))\
        #                                 .order_by(desc(CmccProject.project_status=='Pass'))
        # if search_data['cust_name']:
        #     que = que.filter(CmccProject.cust_name.like('%' + search_data['cust_name'] + '%'))

        # if search_data['chip_name']:
        #     que = que.filter(CmccProject.chip_name == search_data['chip_name'])

        # if search_data['project_name']:
        #     que = que.filter(CmccProject.project_name.like('%' + search_data['project_name'] + '%'))
        
        # for i in range(5):
        #     search_data['project_status'].append('')
        # que = que.filter(or_(CmccProject.project_status == search_data['project_status'][0]\
        #                     , CmccProject.project_status == search_data['project_status'][1]\
        #                     , CmccProject.project_status == search_data['project_status'][2]\
        #                     , CmccProject.project_status == search_data['project_status'][3]\
        #                     , CmccProject.project_status == search_data['project_status'][4]\
        #                     ))

        # result = [row.to_dict() for row in que.offset(search_data['offset']).limit\
        #                                         (search_data['limit']).all()]

        # # for res in result:
        # #     res["Network_type"] = eval(res["Network_type"])
        #     res["Project_owner"] = eval(res["Project_owner"])
        # total = que.count()
        # session.close()
        # return result, total