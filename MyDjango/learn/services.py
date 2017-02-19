# -*- coding: utf-8 -*-
'''处理数据'''
import re
import pdb
import datetime
import datetime as dt
import MySQLdb
from dbconnections import DbConnection

# pylint: disable=C0103
# pylint: disable=W0703
# pylint: disable=W0311
class QuestionsList(object):
    """docstring for QuestionsList"""
    def __init__(self, arg):
        super(QuestionsList, self).__init__()
        self.arg = arg


    @classmethod
    def del_question_num_info(cls, question_num):
      #删除question_num
      conn = DbConnection.get_connection_55()
      cursor = conn.cursor()
      sql = "DELETE FROM the_problem_of_cmcc where question_num in ("+question_num+")"
      cursor.execute(sql)

      conn.commit()
      cursor.close()
      conn.close()


    @classmethod
    def get_question_num_list(cls, project_id):
      ''''获取导出问题数据'''
      conn = DbConnection.get_connection_55()
      cursor = conn.cursor(cursorclass=MySQLdb.cursors.DictCursor)
      args = (project_id)
      sql = "SELECT * FROM the_problem_of_cmcc where project_id=%s"
      cursor.execute(sql, args)
      result_data = cursor.fetchall()

      cursor.close()
      conn.close()

      return result_data


    @classmethod
    def get_questions(cls, search_data):
      '''获取问题列表'''
      conn = DbConnection.get_connection_55()
      cursor = conn.cursor(cursorclass=MySQLdb.cursors.DictCursor)
      group = search_data['group']
      project_id = search_data['project_id']
      question_status = search_data['question_status']
      pageIndex = search_data['pageIndex']
      pageSize = search_data['pageSize']
      to_solve_the_problem_rounds = search_data['to_solve_the_problem_rounds']
      difference_meeting = search_data['difference_meeting']
      action = search_data['action']
      model_name = search_data['model_name']     

      group_l = '%'+group+'%'
      question_status_l = '%'+question_status+'%'
      action_l = '%'+action+'%'
      model_name_l = '%'+model_name+'%'
      offset = int(pageIndex)*int(pageSize)

      args = (difference_meeting, difference_meeting, group_l, group, action_l, \
      action, model_name_l, model_name, project_id, question_status_l, question_status,\
      difference_meeting, difference_meeting, group_l, group, action_l, action, model_name_l,\
      model_name, project_id, question_status_l, question_status, offset, int(pageSize))
      
      sql = "SELECT *, (SELECT COUNT(t0.question_num) FROM the_problem_of_cmcc t0 LEFT JOIN \
        bugs b0 ON t0.question_num = b0.short_desc WHERE"

      if to_solve_the_problem_rounds == 'is_left_question':
        sql += " (t0.close_range is null or trim(t0.close_range = '')) and"

      sql += " (t0.difference_meeting=%s or %s = '') and (t0.groups like %s or %s = '') and \
        (t0.action like %s or %s = '') and (t0.model_name like %s or %s = '') and t0.project_id=%s \
        and (t0.question_status like %s or %s = '')) AS total FROM the_problem_of_cmcc t LEFT JOIN \
        bugs b ON t.question_num = b.short_desc WHERE "

      if to_solve_the_problem_rounds == 'is_left_question':
        sql += " (t.close_range is null or trim(t.close_range = '')) and "
     
      if search_data['question_num']:
        question_num = search_data['question_num']
        question_num = '%%'+question_num+'%%'
        sql += "t.question_num like '"+question_num+"' and "

      sql += " (t.difference_meeting=%s or %s = '') and (t.groups like %s or %s = '') and \
        (t.action like %s or %s = '') and (t.model_name like %s or %s = '') and t.project_id=%s \
        and (t.question_status like %s or %s = '') order by t.question_num asc limit %s, %s"

      cursor.execute(sql, args)
      result_data = cursor.fetchall()

      if len(result_data) == 0:
        total = 0
        return result_data, total
      else:
        total = result_data[0]['total']
      cursor.close()
      conn.close()

      return result_data, total


    @classmethod
    def query_whether_the_same(cls, search_data):
      '''查询一个问题编号是否z只有一个bugs'''
      conn = DbConnection.get_connection_55()
      cursor = conn.cursor(cursorclass=MySQLdb.cursors.DictCursor)
      project_id = search_data['project_id']
      args = (project_id, project_id)
      try:
          sql = "SELECT c.question_num as question_num,c.bug_id as bug_id FROM (SELECT \
          question_num, bug_id FROM the_problem_of_cmcc t LEFT JOIN bugs b ON t.question_num=\
          b.short_desc WHERE t.project_id=%s) c WHERE question_num IN (SELECT question_num \
          FROM (SELECT question_num FROM the_problem_of_cmcc t LEFT JOIN bugs b ON t.question_num=b.short_desc \
          WHERE t.project_id=%s) cc GROUP BY cc.question_num HAVING COUNT(*) > 1 )"
          cursor.execute(sql, args)
          result_data = cursor.fetchall()
      except Exception as e:
          print str(e)

      cursor.close()
      conn.close()

      return result_data


    @classmethod
    def test_range(cls, data):
      '''验证是否符合轮次要求'''      
      project_id = data[0]["project_id"]
      ranges = ['V1', 'V2', 'V3']
      flag = 0
      The_not_qualified_data = []
      test_round_number = QuestionsList.get_test_round_number(project_id)
      onmeeting_time = QuestionsList.get_onmeeting_time(project_id)
      if not test_round_number:
        flag = 1
      else:
          index = []
          index_test = ranges.index(test_round_number[0])
          for i in range(0, len(data)):
            close_range = data[i]["close_range"]
            if close_range == 'Approving':
              if not onmeeting_time:
                The_not_qualified_data.append(data[i])
            else:
              if close_range:
                index_close = ranges.index(close_range)
                if index_close > index_test:
                  The_not_qualified_data.append(data[i])
                  index.append(i)

          if The_not_qualified_data:
            for j in The_not_qualified_data:
              data.remove(j)
            flag = 2

      return flag, data, The_not_qualified_data


    @classmethod
    def modify_questions(cls, data):
      '''修改问题'''      
      conn = DbConnection.get_connection_55()
      cursor = conn.cursor()
      for i in range(0, len(data)):
        project_id = data[i]["project_id"]
        group = data[i]["group"]
        close_range = data[i]["close_range"]
        difference_meeting = data[i]["difference_meeting"]
        question_num = data[i]["question_num"]
        action = data[i]["action"]
        comments = data[i]["comments"]
        args = (close_range, group, difference_meeting, action, project_id, comments, question_num)
        try:
            sql = 'UPDATE the_problem_of_cmcc SET close_range=%s, groups=%s, \
            difference_meeting=%s, action=%s, project_id=%s,comments=%s where question_num=%s'
            cursor.execute(sql, args)
        except Exception as e:
            print str(e)

      conn.commit()
      cursor.close()
      conn.close()


    @classmethod
    def get_test_round_number(cls, project_id):
        '''根据项目id和问题编号查询bug'''
        result = []
        conn = DbConnection.get_connection_55()
        cursor = conn.cursor()
        sql = "SELECT test_round_number from cmcc_project_basic_info where project_id=%s "
        cursor.execute(sql, project_id)
        for row in cursor.fetchall():
          test_round_number, = row
          result.append(test_round_number)

        cursor.close()
        conn.close()

        return result


    @classmethod
    def get_onmeeting_time(cls, project_id):
        '''根据项目id和问题编号查询bug'''
        result = []
        conn = DbConnection.get_connection_55()
        cursor = conn.cursor()
        sql = "SELECT onmeeting_time from cmcc_project_basic_info where project_id=%s "
        cursor.execute(sql, project_id)
        for row in cursor.fetchall():
          onmeeting_time, = row
          result.append(onmeeting_time)

        cursor.close()
        conn.close()

        return result


    @classmethod
    def convert_excel(cls, file_path):
      '''导入数据'''
      # by_name = u'CMCC问题表'
      by_index = 0
      import xlrd
      data = xlrd.open_workbook(file_path)
      sh = data.sheets()[by_index]
      table_head_row = sh.row_values(0)
      table_head_row_list = [[u'question_num', u'问题编号', u'问题序号'], \
                            [u'question_title', u'问题标题'], \
                            [u'question_status', u'问题状态'], \
                            [u'question_serious', u'问题严重性'], \
                            [u'problem_category', u'问题类别'], \
                            [u'model_name', u'模块名称'], \
                            [u'problem_properties', u'问题属性'], \
                            [u'question_content', u'问题内容'], \
                            [u'manufacturer_name', u'厂商名称'], \
                            [u'project_name', u'产品名称'], \
                            [u'the_product_line', u'产品线'], \
                            [u'the_product_type', u'产品类型'],\
                            [u'business_type', u'商务类型'], \
                            [u'software_version', u'软件版本'], \
                            [u'imei', 'IMEI'], \
                            [u'use_cases', u'用例数'], \
                            [u'related_case', u'关联用例'], \
                            [u'ranges', u'发现问题轮次'], \
                            [u'to_solve_the_problem_rounds', u'解决问题轮次'], \
                            [u'close_the_reason', u'关闭原因'], \
                            [u'whether_or_not_to_discuss', u'是否讨论'], \
                            [u'project', u'项目'], \
                            [u'organization', u'组织'], \
                            [u'business_types', u'业务类型'], \
                            [u'test_site', u'测试地点'], \
                            [u'creation_time', u'创建时间'], \
                            [u'closing_time', u'关闭时间']]
      for i in range(0, len(table_head_row)):
          for j in range(0, len(table_head_row_list)):
              if table_head_row[i] in table_head_row_list[j]:
                  table_head_row[i] = table_head_row_list[j][0]
      index = table_head_row.index(u'creation_time')
      #获取行数
      nrows = sh.nrows
      #获取列数
      ncols = sh.ncols
      print "nrows %d, ncols %d" % (nrows, ncols)
      #获取第一行第一列数据
      # cell_value = sh.cell_value(1, 1)
      #print cell_value
      row_list = []
      #获取各行数据
      for i in range(1, nrows):
          row_data = sh.row_values(i)
          date = row_data[index]
          datetime = QuestionsList.getdate(date)
          datetime = datetime.strftime('%Y-%m-%d')
          row_data[index] = datetime
          row_list.append(row_data)

      return row_list, table_head_row


    @classmethod
    def check_whether_the_standard(cls, project_name, excel_list, table_head_row, project_id):
      '''校验字段是否标准'''
      ranges = ['V1', 'V2', 'V3']
      test_round_number = QuestionsList.get_test_round_number(project_id)
      for i in range(0, len(excel_list)):
        index_project_name = table_head_row.index(u'project_name')
        index_solve = table_head_row.index(u'to_solve_the_problem_rounds')
        index_ranges = table_head_row.index(u'ranges')
        index_discuss = table_head_row.index(u'whether_or_not_to_discuss')
        flag = 0
        if excel_list[i][index_project_name].strip() != project_name.strip():
          flag = 1
          break
        if excel_list[i][index_solve] not in ('V1', 'V2', 'V3', u'复验', ''):
          flag = 2
          break
        if not test_round_number and excel_list[i][index_solve]:
          flag = 3
          break
        elif test_round_number and excel_list[i][index_solve]:
          index_test = ranges.index(test_round_number[0])
          to_solve_the_problem_rounds = excel_list[i][index_solve]
          index_close = ranges.index(to_solve_the_problem_rounds)
          if index_close > index_test:
            flag = 4
            break
        else:
          pass
        if excel_list[i][index_ranges] not in ('V1', 'V2', 'V3'):
          flag = 5
          break
        if excel_list[i][index_discuss] not in (u'是', u'否',''):
          flag = 6
          break

      return flag


    @classmethod
    def getdate(cls, date):
      '''格式化时间'''
      __s_date = dt.date(1899, 12, 31).toordinal() - 1
      if isinstance(date, float):
          date = int(date)
          d = dt.date.fromordinal(__s_date+date)
      return d


    @classmethod
    def add_from_excel(cls, excel_list, table_head_row, project_id):
      '''获取excel的数据,保存到表the_problem_of_cmcc'''
      conn = DbConnection.get_connection_55()
      cursor = conn.cursor()
      table_head_info = table_head_row
      index_question_num = table_head_info.index(u'question_num')
      index_question_title = table_head_info.index(u'question_title')
      index_question_status = table_head_info.index(u'question_status')
      index_question_serious = table_head_info.index(u'question_serious')
      index_problem_category = table_head_info.index(u'problem_category')
      index_model_name = table_head_info.index(u'model_name')
      index_problem_properties = table_head_info.index(u'problem_properties')
      index_question_content = table_head_info.index(u'question_content')
      index_manufacturer_name = table_head_info.index(u'manufacturer_name')
      index_project_name = table_head_info.index(u'project_name')
      index_the_product_line = table_head_info.index(u'the_product_line')
      index_the_product_type = table_head_info.index(u'the_product_type')
      index_business_type = table_head_info.index(u'business_type')
      index_software_version = table_head_info.index(u'software_version')
      index_imei = table_head_info.index(u'imei')
      index_use_cases = table_head_info.index(u'use_cases')
      index_related_case = table_head_info.index(u'related_case')
      index_ranges = table_head_info.index(u'ranges')
      index_to_solve_the_problem_rounds = table_head_info.index(u'to_solve_the_problem_rounds')
      index_close_the_reason = table_head_info.index(u'close_the_reason')
      index_whether_or_not_to_discuss = table_head_info.index(u'whether_or_not_to_discuss')
      index_project = table_head_info.index(u'project')
      index_organization = table_head_info.index(u'organization')
      index_business_types = table_head_info.index(u'business_types')
      index_test_site = table_head_info.index(u'test_site')
      index_creation_time = table_head_info.index(u'creation_time')
      index_closing_time = table_head_info.index(u'closing_time')
      table_head = str(','.join(table_head_row))
      table_head = table_head+','+'project_id'
      for i in range(0, len(excel_list)):
          for j in range(0, len(excel_list[i])):
              table_head_row[j] = excel_list[i][j]
          try:
              args = (table_head_row[index_question_title], \
                      table_head_row[index_question_status],\
                      table_head_row[index_question_serious], \
                      table_head_row[index_problem_category],\
                      table_head_row[index_model_name], \
                      table_head_row[index_problem_properties],\
                      table_head_row[index_question_content], \
                      table_head_row[index_manufacturer_name],\
                      table_head_row[index_project_name], \
                      table_head_row[index_the_product_line],\
                      table_head_row[index_the_product_type], \
                      table_head_row[index_business_type],\
                      table_head_row[index_software_version], \
                      table_head_row[index_imei],\
                      table_head_row[index_use_cases], \
                      table_head_row[index_related_case],\
                      table_head_row[index_to_solve_the_problem_rounds], \
                      table_head_row[index_close_the_reason],\
                      table_head_row[index_whether_or_not_to_discuss], \
                      table_head_row[index_project],\
                      table_head_row[index_organization], \
                      table_head_row[index_business_types],\
                      table_head_row[index_test_site], \
                      table_head_row[index_creation_time],\
                      table_head_row[index_closing_time], \
                      project_id, table_head_row[index_question_num],\
                      table_head_row[index_ranges])
              sql = 'INSERT INTO the_problem_of_cmcc(question_title, question_status, question_serious,\
              problem_category, model_name, problem_properties, question_content, manufacturer_name,\
              project_name, the_product_line, the_product_type, business_type, software_version,\
              imei, use_cases, related_case, to_solve_the_problem_rounds, close_the_reason,\
              whether_or_not_to_discuss, project, organization, business_types, test_site,\
              creation_time, closing_time, project_id, question_num, ranges) VALUES(%s, %s, %s, %s, %s, %s, %s, %s, \
              %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)ON DUPLICATE KEY UPDATE\
              question_title=VALUES(question_title), question_status=VALUES(question_status),\
              question_serious=VALUES(question_serious), problem_category=VALUES(problem_category),\
              model_name=VALUES(model_name), problem_properties=VALUES(problem_properties),\
              question_content=VALUES(question_content), manufacturer_name=VALUES(manufacturer_name),\
              project_name=VALUES(project_name), the_product_line=VALUES(the_product_line),\
              the_product_type=VALUES(the_product_type), business_type=VALUES(business_type),\
              software_version=VALUES(software_version), imei=VALUES(imei),\
              use_cases=VALUES(use_cases), related_case=VALUES(related_case),\
              to_solve_the_problem_rounds=VALUES(to_solve_the_problem_rounds), close_the_reason=VALUES(close_the_reason),\
              whether_or_not_to_discuss=VALUES(whether_or_not_to_discuss), project=VALUES(project),\
              organization=VALUES(organization), business_types=VALUES(business_types),\
              test_site=VALUES(test_site), creation_time=VALUES(creation_time),\
              closing_time=VALUES(closing_time), project_id=VALUES(project_id),\
              ranges=VALUES(ranges)'
              cursor.execute(sql, args)
          except Exception as e:
              print str(e)

      conn.commit()
      cursor.close()
      conn.close()


    @classmethod
    def update_colse_range(cls, project_id):
      '''更新关闭轮次'''
      conn = DbConnection.get_connection_55()
      cursor = conn.cursor()
      try:
        sql = "SELECT question_num, to_solve_the_problem_rounds FROM \
        the_problem_of_cmcc where project_id=%s and to_solve_the_problem_rounds != ''"
        cursor.execute(sql, project_id)
        for row in cursor.fetchall():
          question_num, to_solve_the_problem_rounds = row
          args = (to_solve_the_problem_rounds, question_num)
          sql = "UPDATE the_problem_of_cmcc SET close_range=%s where question_num=%s"
          cursor.execute(sql, args)
      except Exception as e:
        print str(e)

      conn.commit()
      cursor.close()
      conn.close()


    @classmethod
    def update_difference_meeting(cls, project_id):
      '''更新上会条件'''
      conn = DbConnection.get_connection_55()
      cursor = conn.cursor()
      try:
        sql = "SELECT question_num, question_serious, model_name FROM the_problem_of_cmcc \
        where project_id=%s"
        cursor.execute(sql, project_id)
        for row in cursor.fetchall():
          question_num, question_serious, model_name = row
          difference_meeting = 'YES'
          if u'普通' in question_serious:
            difference_meeting = 'NO'
          if u'省公司' in model_name:
            difference_meeting = 'NO'
          args = (difference_meeting, question_num)
          sql = "UPDATE the_problem_of_cmcc SET difference_meeting=%s where question_num=%s"
          cursor.execute(sql, args)
      except Exception as e:
        print str(e)

      conn.commit()
      cursor.close()
      conn.close()


    @classmethod
    def format_question_num_to_date(cls, project_id):
      '''格式化问题编号成时间'''
      conn = DbConnection.get_connection_55()
      cursor = conn.cursor()
      try:
        sql = "SELECT question_num, question_num_date FROM the_problem_of_cmcc WHERE project_id=%s"
        cursor.execute(sql, project_id)
        for row in cursor.fetchall():
          question_num, question_num_date = row
          question_num_format = re.search(r'20\d{2}(0[1-9]|1[1-2])(0[1-9]|2[0-9]|3[0-1])', \
          question_num).group(0)
          question_num_format = datetime.datetime.strptime(question_num_format, "%Y%m%d").\
          strftime('%Y-%m-%d')
          args = (question_num_format, question_num)
          sql = "UPDATE the_problem_of_cmcc SET question_num_date=%s where question_num=%s"
          cursor.execute(sql, args)
      except Exception as e:
        print str(e)

      conn.commit()
      cursor.close()
      conn.close()
