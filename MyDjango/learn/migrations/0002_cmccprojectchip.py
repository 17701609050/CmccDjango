# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('learn', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CmccProjectChip',
            fields=[
                ('chipid', models.AutoField(serialize=False, primary_key=True)),
                ('chip_name', models.CharField(max_length=50)),
                ('CPM', models.CharField(max_length=50)),
                ('SW_TAM', models.CharField(max_length=50)),
                ('HW_TAM', models.CharField(max_length=50)),
                ('HW_RF', models.CharField(max_length=50)),
                ('Audio_PL', models.CharField(max_length=50)),
                ('Power_PL', models.CharField(max_length=50)),
                ('PPM', models.CharField(max_length=50)),
                ('Ali_PM', models.CharField(max_length=50)),
                ('PLD_PM', models.CharField(max_length=50)),
                ('CSD_PM', models.CharField(max_length=50)),
                ('PHY_PL', models.CharField(max_length=50)),
                ('Test_PL', models.CharField(max_length=50)),
                ('PICLAB_FO', models.CharField(max_length=50)),
                ('FT_FO', models.CharField(max_length=50)),
            ],
        ),
    ]
