from django.db.models import F, OuterRef, Subquery
from django.http import HttpResponseNotFound, HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import ListView, DetailView
from django.views.generic.edit import FormMixin

from goods.forms import ReviewForm
from goods.models import Product, ProductImage, Category
from goods.utils import DataMixin, ProductFilter


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

# class CatalogPage(DataMixin, ListView):
#     model = Product
#     template_name = 'goods/main_page.html'
#     context_object_name = 'products_qs'
#     allow_empty = True
#     paginate_by = 4
#     #Подправить пагинатор
#
#     def get_queryset(self):
#         products_qs = self.get_products_with_previews(Product.objects.filter(is_published=True))
#         return products_qs
#
#     def get_context_data(self, **kwargs):
#         context = super().get_context_data(**kwargs)
#         mixin_context = self.get_user_context(title='Каталог')
#         return dict(list(context.items()) + list(mixin_context.items()))


class ProductView(FormMixin, DataMixin, DetailView):
    model = Product
    template_name = 'goods/product_page.html'
    context_object_name = 'product'

    form_class = ReviewForm

    def get_object(self, *args, **kwargs):
        return Product.objects.prefetch_related('images').get(slug=self.kwargs['product_slug'])

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        preview = self.object.images.first()
        mixin_context = self.get_user_context(title='Головна сторінка', preview=preview)
        context.update({'form': self.get_form()})
        return dict(list(context.items()) + list(mixin_context.items()))

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        form = self.get_form()
        if form.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)

    def form_valid(self, form):
        review = form.save(commit=False)
        review.user = self.request.user
        review.product = self.object
        review.save()
        return super().form_valid(form)

    def form_invalid(self, form):
        context = self.get_context_data(form=form)
        return self.render_to_response(context)

    def get_success_url(self):
        return self.request.get_full_path()





class CatalogPage(DataMixin, ListView):
    model = Product
    template_name = 'goods/catalog_page.html'
    context_object_name = 'products_qs'
    allow_empty = True
    cat_slug = None
    paginate_by = 4

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


class SearchPage(DataMixin, ListView):
    model = Product
    template_name = 'goods/catalog_page.html'
    context_object_name = 'products_qs'
    paginate_by = 4
    allow_empty = True
    pd_filter = None

    def get_queryset(self):
        products_qs = self.get_products_with_previews(Product.objects.filter(is_published=True))
        self.pd_filter = ProductFilter(self.request.GET, queryset=products_qs)
        products_qs = self.pd_filter.qs

        return products_qs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        mixin_context = self.get_user_context(title='Nexus')
        return dict(list(context.items()) + list(mixin_context.items()))

def page_not_found(request, exception):
    return HttpResponseNotFound('<h1>Сторінка не знайдена</h1>')
