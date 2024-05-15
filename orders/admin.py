from dal import autocomplete
from django.contrib import admin
from django.utils.html import format_html

from goods.models import Product
from orders.models import OrderItem, Order
from django import forms

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order',
                    'product',
                    'name',
                    'quantity',
                    'created_timestamp',)

    search_fields = ('order', 'product', 'name',)

class OrderSneakersAdminForm(forms.ModelForm):
    class Meta:
        model = OrderItem
        fields = '__all__'
        widgets = {
            'product': autocomplete.ModelSelect2(url='products-autocomplete')
        }


class OrderItemAdminTabular(admin.TabularInline):
    form = OrderSneakersAdminForm
    model = OrderItem
    fields = ('product', 'name', 'price', 'quantity')
    search_fields = ('product__title', 'name')
    extra = 0

    # def get_product_image(self, obj):
    #     if obj.product.first_image:
    #         return format_html(f'<img src="{obj.product.first_image.image}" width="50" height="50" />')
    #     return None
    #
    # get_product_image.short_description = 'Product Image'


class OrderAdminTabular(admin.TabularInline):
    model = Order
    fields = (
        "status",
        "requires_delivery",
        "payment_on_get",
        "is_paid",
        "created_timestamp",
    )

    search_fields = (
        "requires_delivery",
        "payment_on_get",
        "is_paid",
        "created_timestamp",
    )
    readonly_fields = ("created_timestamp",)
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id",
                    "user",
                    "requires_delivery",
                    "status",
                    "payment_on_get",
                    "is_paid",
                    "created_timestamp",
                    )

    list_display_links = ('id', 'user')

    search_fields = ('id', 'is_paid', 'created_timestamp')
    list_filter = ('requires_delivery',
                   'payment_on_get',
                   'is_paid',
                   'created_timestamp',
                   'status',
                   )
    inlines = (OrderItemAdminTabular,)