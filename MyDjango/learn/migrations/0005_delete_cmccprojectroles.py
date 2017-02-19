# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('learn', '0004_cmccprojectroles'),
    ]

    operations = [
        migrations.DeleteModel(
            name='CmccProjectRoles',
        ),
    ]
