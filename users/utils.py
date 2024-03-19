import re
from django import forms
from django.contrib.auth import get_user_model

User = get_user_model()


def validate_email(email):
    if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email) and len(email) > 254:
        raise forms.ValidationError("Некоректний формат email адреси")

    if User.objects.filter(email=email).exists():
        raise forms.ValidationError("Користувач з такою адресою електронної пошти вже існує")