from django.db.models import F, OuterRef, Subquery
from django.http import HttpResponseNotFound, HttpResponse
from django.shortcuts import render
from django.views.generic import ListView

from goods.models import Product, ProductImage
from goods.utils import DataMixin


# Create your views here.
def main_page(request):

    first_image_subquery = ProductImage.objects.filter(
        product_id=OuterRef('pk')
    ).order_by('id').values('image')[:1]

    products_qs = Product.objects.filter(is_published=True).annotate(
        preview=Subquery(first_image_subquery)
    )

    mixin_context = DataMixin().get_user_context()

    context = {
        'title': 'Головна сторінка',
        'products_qs': products_qs,
    }

    context = dict(list(context.items()) + list(mixin_context.items()))

    return render(request, 'goods/main_page.html', context)


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

def page_not_found(request, exception):
    return HttpResponseNotFound('<h1>Сторінка не знайдена</h1>')