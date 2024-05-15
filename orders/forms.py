import re

from django import forms


class CreateOrderForm(forms.Form):
    first_name = forms.CharField()
    last_name = forms.CharField()
    email = forms.CharField()
    phone_number = forms.CharField()
    requires_delivery = forms.ChoiceField(
        choices=[
            ('0', False),
            ('1', True), ])
    delivery_address = forms.CharField(required=False)
    payment_on_get = forms.ChoiceField(
        choices=[
            ('0', False),
            ('1', True), ])
    requires_registration = forms.ChoiceField(
        choices=[
            ('0', False),
            ('1', True), ])

    password1 = forms.CharField(required=False)
    password2 = forms.CharField(required=False)

    def clean_phone_number(self):
        data = self.cleaned_data['phone_number']

        if not data.isdigit():
            raise forms.ValidationError("Номер телефона потрібен містити тільки цифри")

        pattern = re.compile(r'^\d{10}$')
        if not pattern.match(data):
            raise forms.ValidationError("Невірний формат номера")

        return data

    def clean(self):
        cleaned_data = super().clean()
        requires_registration = cleaned_data.get('requires_registration')
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')

        if requires_registration == '1':
            # Если выбрана опция регистрации, проверяем пароли
            if not password1 or not password2:
                raise forms.ValidationError("Пароль та повторення паролю обов'язкові")
            if password1 != password2:
                raise forms.ValidationError("Паролі не співпадають")

        return cleaned_data