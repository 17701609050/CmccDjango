# -*- coding: utf-8 -*-
'''处理数据'''
import re
import datetime
from flask import Flask
from dbconnections import DbConnection

# app = Flask(__name__)
# pylint: disable=W0311
def format_question_num_to_date():
  '''格式化问题编号的时间'''
  conn = DbConnection.get_connection_55()
  cursor = conn.cursor()
  try:
    sql = "SELECT question_num, question_num_date FROM the_problem_of_cmcc"
    cursor.execute(sql)
    for row in cursor.fetchall():
      question_num, question_num_date = row
      question_num_format = re.search(r'20\d{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])', \
      question_num).group(0)
      question_num_format = datetime.datetime.strptime(question_num_format, "%Y%m%d"\
      ).strftime('%Y-%m-%d')
      args = (question_num_format,question_num)
      sql = "UPDATE the_problem_of_cmcc SET question_num_date=%s where question_num=%s"
      cursor.execute(sql, args)
  except Exception as e:
    print str(e)

  conn.commit()
  cursor.close()
  conn.close()


def update_difference_meeting():
  '''根据条件更新上会时间'''
  conn = DbConnection.get_connection_55()
  cursor = conn.cursor()
  try:
    sql = "SELECT question_num, question_serious, model_name FROM the_problem_of_cmcc"
    cursor.execute(sql)
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


def update_colse_range():
  '''更新关闭轮次'''
  conn = DbConnection.get_connection_55()
  cursor = conn.cursor()
  try:
    sql = "SELECT question_num, to_solve_the_problem_rounds FROM the_problem_of_cmcc where \
    to_solve_the_problem_rounds != ''"
    cursor.execute(sql)
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


if __name__ == "__main__":
    # app.debug = True
    # app.run(host='0.0.0.0', port=5000)
    format_question_num_to_date()
