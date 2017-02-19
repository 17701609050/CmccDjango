# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('learn', '0002_cmccprojectchip'),
    ]

    operations = [
        migrations.CreateModel(
            name='CmccProject',
            fields=[
                ('project_id', models.AutoField(serialize=False, primary_key=True)),
                ('chip_name', models.CharField(max_length=50)),
                ('cust_name', models.CharField(max_length=50)),
                ('send_test_type', models.CharField(max_length=50)),
                ('test_range', models.CharField(max_length=50)),
                ('plan_sendtest_time', models.CharField(max_length=50)),
                ('operate_system', models.CharField(max_length=50)),
                ('Radiofrequency_PA', models.CharField(max_length=50)),
                ('project_name', models.CharField(max_length=50)),
                ('config_name', models.CharField(max_length=50)),
                ('current_status', models.CharField(max_length=50)),
                ('v1_sendtest_time', models.CharField(max_length=50)),
                ('v1_software_version', models.CharField(max_length=50)),
                ('v2_sendtest_time', models.CharField(max_length=50)),
                ('v2_software_version', models.CharField(max_length=50)),
                ('v3_sendtest_time', models.CharField(max_length=50)),
                ('v3_software_version', models.CharField(max_length=50)),
                ('onmeeting_time', models.CharField(max_length=50)),
                ('passed_time', models.CharField(max_length=50)),
                ('v2_plan_sendtest_time', models.CharField(max_length=50)),
                ('v3_plan_sendtest_time', models.CharField(max_length=50)),
                ('passed_round_number', models.CharField(max_length=50)),
                ('test_round_number', models.CharField(max_length=50)),
                ('warehousing_month', models.CharField(max_length=50)),
                ('out_warehousing_month', models.CharField(max_length=50)),
                ('warehousing_days', models.CharField(max_length=50)),
                ('project_status', models.CharField(max_length=50)),
                ('submiter', models.CharField(max_length=50)),
                ('Network_type', models.CharField(max_length=50)),
                ('Project_owner', models.CharField(max_length=50)),
                ('test_items', models.CharField(max_length=500)),
                ('Cust_Model', models.CharField(max_length=500)),
            ],
        ),
    ]
