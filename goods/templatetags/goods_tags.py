from django import template
from django.db.models import Min, Max, F

from goods.models import Product, Wish
from goods.utils import DataMixin, get_user_wishes

register = template.Library()

@register.inclusion_tag('includes/paginator.html', takes_context=True)
def show_paginator(context, paginator, page_obj):
    request = context['request'].GET.dict()
    return {"paginator": paginator, 'page_obj': page_obj, 'request': request}

@register.simple_tag(name='load_best_products')
def load_best_products():
    return DataMixin().get_products_with_previews(
        Product.objects.filter(is_published=True, cat__slug='best').order_by('-price')
    )


@register.simple_tag(name='load_same_products')
def load_same_products(cat_id, product_id):
    return DataMixin().get_products_with_previews(
        Product.objects.filter(is_published=True, cat_id=cat_id).order_by('-price').exclude(id=product_id).distinct()
    )

@register.inclusion_tag('includes/breadcrumbs.html')
def get_breadcrumbs(category):
    return {
        'category': category
    }

@register.simple_tag(name='get_min_max_prices', takes_context=True)
def get_prices(context):
    aggregate_data = Product.objects.filter(is_published=True).aggregate(
        min_price=Min('sell_price'),
        max_price=Max('sell_price'),
    )

    min_price = int(aggregate_data['min_price']) if aggregate_data['min_price'] is not None else None
    max_price = int(aggregate_data['max_price']) if aggregate_data['max_price'] is not None else None

    context['min_price'] = min_price
    context['max_price'] = max_price

    return ''


@register.simple_tag(name='get_recently_viewed_products', takes_context=True)
def get_recently_viewed_products(context):
    recently_viewed_qs = (
        DataMixin().get_products_with_previews(Product.objects.filter(
            slug__in=context['request'].session.get("recently_viewed",
                                                    []))))
    return recently_viewed_qs


@register.simple_tag(name='user_wishes')
def user_wishes(request):
    return get_user_wishes(request)
