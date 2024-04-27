from django.db import models
from users.models import User
from goods.models import Product


class CartQuerySet(models.QuerySet):
    def total_price(self):
        return sum(cart.product_price() for cart in self)

    def total_quantity(self):
        if self:
            return sum(cart.quantity for cart in self)
        return 0


class Cart(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.CASCADE, blank = True, null = True, verbose_name="Користувач")
    product = models.ForeignKey(to=Product, on_delete=models.CASCADE, verbose_name="Товар")
    quantity = models.PositiveSmallIntegerField(default=0, verbose_name="Кількість")
    session_key = models.CharField(max_length=32, null=True, blank=True)
    created_timestamp = models.DateTimeField(auto_now_add=True, verbose_name="Дата додавання")

    class Meta:
        db_table = 'cart'
        verbose_name = "Кошик"
        verbose_name_plural = "Кошик"

    objects = CartQuerySet().as_manager()

    def product_price(self):
        return round(self.product.calculate_sell_price() * self.quantity, 2)

    def __str__(self):
        if self.user:
            return f"Кошик користувача {self.user.username} | Товар {self.product.title} | Кількість {self.quantity}"
        return f"Анонімний кошик | Товар {self.product.title} | Кількість {self.quantity}"