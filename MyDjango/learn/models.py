#coding:utf-8
from django.db import models
import json

class Person(models.Model):
    name = models.CharField(max_length=30)
    age = models.IntegerField()

    def __unicode__(self):
    # 在Python3中使用 def __str__(self)
        return self.name

class CmccProjectChip(models.Model):
	chipid = models.AutoField(primary_key=True)
	chip_name = models.CharField(max_length=50)
	CPM = models.CharField(max_length=50)
	SW_TAM = models.CharField(max_length=50)
	HW_TAM = models.CharField(max_length=50)
	HW_RF = models.CharField(max_length=50)
	Audio_PL = models.CharField(max_length=50)
	Power_PL = models.CharField(max_length=50)
	PPM = models.CharField(max_length=50)
	Ali_PM = models.CharField(max_length=50)
	PLD_PM = models.CharField(max_length=50)
	CSD_PM = models.CharField(max_length=50)
	PHY_PL = models.CharField(max_length=50)
	Test_PL = models.CharField(max_length=50)
	PICLAB_FO = models.CharField(max_length=50)
	FT_FO = models.CharField(max_length=50)

	def toJSON(self):
		
	    return dict([(attr, getattr(self, attr)) for attr in [f.name for f in self._meta.fields]])

	def __unicode__(self):
	# 在Python3中使用 def __str__(self)
	    return self.chipid




class CmccProject(models.Model):
    ''' 项目信息表 '''

    project_id = models.AutoField(primary_key=True)
    chip_name = models.CharField(max_length=50)
    cust_name = models.CharField(max_length=50)
    send_test_type = models.CharField(max_length=50)
    test_range =models.CharField(max_length=50)
    plan_sendtest_time = models.CharField(max_length=50)
    operate_system =models.CharField(max_length=50)
    Radiofrequency_PA = models.CharField(max_length=50)
    project_name = models.CharField(max_length=50)
    config_name = models.CharField(max_length=50)
    current_status = models.CharField(max_length=50)
    v1_sendtest_time = models.CharField(max_length=50)
    v1_software_version = models.CharField(max_length=50)
    v2_sendtest_time = models.CharField(max_length=50)
    v2_software_version = models.CharField(max_length=50)
    v3_sendtest_time = models.CharField(max_length=50)
    v3_software_version = models.CharField(max_length=50)
    onmeeting_time = models.CharField(max_length=50)
    passed_time = models.CharField(max_length=50)
    v2_plan_sendtest_time = models.CharField(max_length=50)
    v3_plan_sendtest_time = models.CharField(max_length=50)
    passed_round_number = models.CharField(max_length=50)
    test_round_number = models.CharField(max_length=50)
    warehousing_month = models.CharField(max_length=50)
    out_warehousing_month = models.CharField(max_length=50)
    warehousing_days = models.CharField(max_length=50)
    project_status = models.CharField(max_length=50)
    submiter = models.CharField(max_length=50)
    Network_type = models.CharField(max_length=50)
    Project_owner = models.CharField(max_length=50)
    test_items = models.CharField(max_length=500)
    Cust_Model = models.CharField(max_length=500)

    class Meta:
        verbose_name ='CmccProject'
        verbose_name_plural = 'CmccProject'

    @staticmethod
    def get_all_project(data):

        resultdata = CmccProject.objects.all()

        result_list = []
        for res in resultdata:

            result_list.append(json.loads(res.toJSON()))

        return result_list, len(result_list)

    @classmethod
    def json_to_cmcc_project(self, data):
        ''' 返回项目对象 '''
        return {
            "chip_name":data.get("chip_name", ''),
            "cust_name":data.get("cust_name", ''),
            "send_test_type":data.get("send_test_type", ''),
            "test_range":data.get("test_range", ''),
            "plan_sendtest_time":data.get("plan_sendtest_time", ''),
            "operate_system":data.get("operate_system", ''),
            "Radiofrequency_PA":data.get("Radiofrequency_PA", ''),
            "project_name":data.get("project_name", ''),
            "config_name":data.get("config_name", ''),
            "current_status":data.get("current_status", ''),
            "v1_sendtest_time":data.get("v1_sendtest_time", ''),
            "v1_software_version":data.get("v1_software_version", ''),
            "v2_sendtest_time":data.get("v2_sendtest_time", ''),
            "v2_software_version":data.get("v2_software_version", ''),
            "v3_sendtest_time":data.get("v3_sendtest_time", ''),
            "v3_software_version":data.get("v3_software_version", ''),
            "onmeeting_time":data.get("onmeeting_time", ''),
            "passed_time":data.get("passed_time", ''),
            "v2_plan_sendtest_time":data.get("v2_plan_sendtest_time", ''),
            "v3_plan_sendtest_time":data.get("v3_plan_sendtest_time", ''),
            "passed_round_number":data.get("passed_round", ''),
            "test_round_number":data.get("test_round", ''),
            "warehousing_month":data.get("warehousing_month", ''),
            "out_warehousing_month":data.get("out_warehousing_month", ''),
            "warehousing_days":data.get("warehousing_days", ''),
            "project_status":data.get("project_status", ''),
            "submiter":data.get("submiter", ''),
            "Network_type":data.get("Network_type", ''),
            "Project_owner":data.get("Project_owner", ''),
            "test_items":data.get("test_items", ''),
            "Cust_Model":data.get("Cust_Model", '')
        }

    def toJSON(self):
	    
	    return json.dumps(dict([(attr, getattr(self, attr)) for attr in [f.name for f in self._meta.fields]]))


class CmccProjectStakeholders(models.Model):
    # chipid = models.AutoField(primary_key=True)
    # chip_name = models.CharField(max_length=50)
    CPM = models.CharField(max_length=50)
    SW_TAM = models.CharField(max_length=50)
    HW_TAM = models.CharField(max_length=50)
    HW_RF = models.CharField(max_length=50)
    Audio_PL = models.CharField(max_length=50)
    Power_PL = models.CharField(max_length=50)
    PPM = models.CharField(max_length=50)
    Ali_PM = models.CharField(max_length=50)
    PLD_PM = models.CharField(max_length=50)
    CSD_PM = models.CharField(max_length=50)
    PHY_PL = models.CharField(max_length=50)
    Test_PL = models.CharField(max_length=50)
    PICLAB_FO = models.CharField(max_length=50)
    FT_FO = models.CharField(max_length=50)
    project = models.ForeignKey('CmccProject')

    @classmethod
    def json_to_cmcc_projectStakeholders(self, data):
        ''' 返回项目对象 '''
        return {
            "CPM":data.get("CPM", ''),
            "SW_TAM":data.get("SW_TAM", ''),
            "HW_TAM":data.get("HW_TAM", ''),
            "HW_RF":data.get("HW_RF", ''),
            "Audio_PL":data.get("Audio_PL", ''),
            "Power_PL":data.get("Power_PL", ''),
            "PPM":data.get("PPM", ''),
            "Ali_PM":data.get("Ali_PM", ''),
            "PLD_PM":data.get("PLD_PM", ''),
            "CSD_PM":data.get("CSD_PM", ''),
            "PHY_PL":data.get("PHY_PL", ''),
            "Test_PL":data.get("Test_PL", ''),
            "PICLAB_FO":data.get("PICLAB_FO", ''),
            "FT_FO":data.get("FT_FO", '')
             
        }

    def toJSON(self):
        
        return dict([(attr, getattr(self, attr)) for attr in [f.name for f in self._meta.fields]])

    def __unicode__(self):
    # 在Python3中使用 def __str__(self)
        return self.CPM
