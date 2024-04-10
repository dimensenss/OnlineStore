from django.contrib import admin

from carts.models import Cart


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('product', 'quantity', 'product_price')
