from django.db.models import F, OuterRef, Subquery
from django.http import HttpResponseNotFound, HttpResponse
from django.shortcuts import render, get_object_or_404
from django.views.generic import ListView, DetailView
from goods.models import Product, ProductImage, Category
from goods.utils import DataMixin


class MainPage(DataMixin, ListView):
    model = Product
    template_name = 'goods/main_page.html'
    context_object_name = 'products_qs'
    allow_empty = True

    def get_queryset(self):
        products_qs = self.get_products_with_previews(Product.objects.filter(is_published=True))
        return products_qs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        mixin_context = self.get_user_context(title='Головна сторінка')
        return dict(list(context.items()) + list(mixin_context.items()))


class ProductView(DataMixin, DetailView):
    model = Product
    template_name = 'goods/product_page.html'
    context_object_name = 'product'

    def get_object(self, *args, **kwargs):
        return Product.objects.get(slug=self.kwargs['product_slug'])

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        mixin_context = self.get_user_context(title='Головна сторінка')
        return dict(list(context.items()) + list(mixin_context.items()))


class CategoriesPage(DataMixin, ListView):
    model = Product
    template_name = 'goods/main_page.html'
    context_object_name = 'products_qs'
    allow_empty = True
    cat_slug = None

    def get_queryset(self):
        self.cat_slug = self.kwargs['cat_slug'].split('/')[-1]
        current_category = get_object_or_404(Category, slug=self.cat_slug)

        subcategories = current_category.get_descendants(include_self=True)
        product_qs = self.get_products_with_previews(
            Product.objects.filter(cat__in=subcategories, is_published=True).select_related('cat'))
        return product_qs

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        c_def = self.get_user_context(title=self.cat_slug)
        return dict(list(context.items()) + list(c_def.items()))


def page_not_found(request, exception):
    return HttpResponseNotFound('<h1>Сторінка не знайдена</h1>')
