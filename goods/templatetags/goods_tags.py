from django import template

from goods.models import Product
from goods.utils import DataMixin

register = template.Library()

@register.inclusion_tag('includes/paginator.html', takes_context=True)
def show_paginator(context, paginator, page_obj):
    request = context['request'].GET.dict()
    return {"paginator": paginator, 'page_obj': page_obj, 'request': request}

@register.simple_tag(name='load_best_products')
def load_best_products():
    return DataMixin().get_products_with_previews(
        Product.objects.filter(is_published=True, cat__title='Best').order_by('-price')
    )