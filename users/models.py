from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    image = models.ImageField(upload_to="user_photo/%Y/%m/%d/", blank=True, null = True, verbose_name='Зображення користувача')
    phone_number = models.CharField(max_length=10, blank=True, null = True, verbose_name='Телефон')

    class Meta:
        db_table = 'user'
        verbose_name = 'Користувач'
        verbose_name_plural = 'Користувачі'

    def __str__(self):
        return self.username