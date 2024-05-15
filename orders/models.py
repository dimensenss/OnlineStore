from django.contrib.sessions.models import Session
from django.db import models
from goods.models import Product
from users.models import User


class OrderItemQueryset(models.QuerySet):

    def total_price(self):
        return sum(cart.products_price() for cart in self)

    def total_quantity(self):
        if self:
            return sum(cart.quantity for cart in self)
        return 0


class Order(models.Model):
    STATUS_CHOICES = [
        ('В обробці', 'В обробці'),
        ('Відправлено', 'Відправлено'),
        ('Доставлено', 'Доставлено'),
        ('Скасовано', 'Скасовано'),
    ]

    user = models.ForeignKey(to=User, on_delete=models.SET_DEFAULT, blank=True, null=True, verbose_name="Користувач", default=None)
    created_timestamp = models.DateTimeField(auto_now_add=True, verbose_name="Дата створення замовлення")
    phone_number = models.CharField(max_length=20, verbose_name="Номер телефона")
    email = models.CharField(max_length=50, verbose_name="Email", null=True, blank=True)
    requires_delivery = models.BooleanField(default=False, verbose_name="Потрібна доставка")
    delivery_address = models.TextField(null=True, blank=True, verbose_name="Адреса доставки")
    payment_on_get = models.BooleanField(default=False, verbose_name="Оплата при отриманні")
    is_paid = models.BooleanField(default=False, verbose_name="Сплачено")
    session = models.CharField(null=True, blank=True, verbose_name="Сесія")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='В обробці', verbose_name="Статус")

    class Meta:
        db_table = "order"
        verbose_name = "Замовлення"
        verbose_name_plural = "Замовлення"

    def __str__(self):
        return f"Заказ № {self.pk}"



class OrderItem(models.Model):
    order = models.ForeignKey(to=Order, on_delete=models.CASCADE, verbose_name="Заказ")
    product = models.ForeignKey(to=Product, on_delete=models.SET_DEFAULT, null=True, verbose_name="Продукт", default=None)
    name = models.CharField(max_length=150, verbose_name="Назва")
    price = models.DecimalField(max_digits=7, decimal_places=2, verbose_name="Ціна")
    quantity = models.PositiveIntegerField(default=0, verbose_name="Кількість")
    created_timestamp = models.DateTimeField(auto_now_add=True, verbose_name="Дата продажу")

    class Meta:
        db_table = "order_item"
        verbose_name = "Проданий товар"
        verbose_name_plural = "Продані товари"

    objects = OrderItemQueryset.as_manager()

    def products_price(self):
        return round(self.product.calculate_sell_price() * self.quantity, 2)

    def __str__(self):
        return f"Товар {self.name} | Заказ № {self.order.pk}"