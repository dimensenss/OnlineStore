# Generated by Django 5.0.3 on 2024-05-25 11:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('goods', '0019_alter_review_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='is_available',
            field=models.BooleanField(default=True, verbose_name='В наявності'),
        ),
    ]
