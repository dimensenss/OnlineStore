# Generated by Django 5.0.3 on 2024-05-17 11:05

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('goods', '0015_attributesvalues_alter_productattribute_value'),
    ]

    operations = [
        migrations.CreateModel(
            name='AttributesNames',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=100, verbose_name='value')),
            ],
        ),
        migrations.RemoveField(
            model_name='productattribute',
            name='name',
        ),
        migrations.AddField(
            model_name='productattribute',
            name='atr_name',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='atr_name', to='goods.attributesnames', verbose_name='Назва'),
        ),
    ]