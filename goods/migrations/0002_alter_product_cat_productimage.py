# Generated by Django 5.0.3 on 2024-03-15 20:09

import django.db.models.deletion
import imagekit.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('goods', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='cat',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.SET_DEFAULT, related_name='products', to='goods.category', verbose_name='Категорія'),
        ),
        migrations.CreateModel(
            name='ProductImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', imagekit.models.fields.ProcessedImageField(upload_to='product_images/%Y/%m/%d/')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='goods.product')),
            ],
            options={
                'verbose_name': 'Фотографія',
                'verbose_name_plural': 'Фотографії',
            },
        ),
    ]