# Generated by Django 5.0.3 on 2024-04-02 10:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('goods', '0003_product_brand_product_extra_attributes'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='quantity',
            field=models.PositiveIntegerField(default=1, verbose_name='Кількість'),
        ),
    ]
