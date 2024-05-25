from django.db.models import F, OuterRef, Subquery
from django.http import HttpResponseNotFound, HttpResponse, JsonResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.template.loader import render_to_string
from django.views.generic import ListView, DetailView
from django.views.generic.edit import FormMixin

from OnlineStore.settings import MAX_RECENT_VIEWED_PRODUCTS
from goods.forms import ReviewForm
from goods.models import Product, ProductImage, Category, Review
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


class ProductView(FormMixin, DataMixin, DetailView):
    model = Product
    template_name = 'goods/product_page.html'
    context_object_name = 'product'

    form_class = ReviewForm

    def get_object(self, *args, **kwargs):
        recently_viewed(self.request, self.kwargs['product_slug'])
        return Product.objects.prefetch_related('images', 'attributes').get(slug=self.kwargs['product_slug'])

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        preview = self.object.load_preview()
        reviews_qs = self.object.reviews.all().prefetch_related('user').order_by('-date')
        mixin_context = self.get_user_context(title='Головна сторінка', preview=preview, reviews_qs=reviews_qs)
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
    paginate_by = 12

    def get_queryset(self):
        self.cat_slug = self.kwargs['cat_slug'].split('/')[-1]
        current_category = get_object_or_404(Category, slug=self.cat_slug)

        subcategories = current_category.get_descendants(include_self=True)
        product_qs = self.get_products_with_previews(
            Product.objects.filter(cat__in=subcategories, is_published=True).select_related('cat'))

        self.filtered_qs = ProductFilter(self.request.GET, queryset=product_qs)
        product_qs = self.filtered_qs.qs

        return product_qs

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        c_def = self.get_user_context(title=self.cat_slug, filter=self.filtered_qs)
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


def remove_review(request):
    if request.method == 'GET':
        review_id = request.GET.get('review_id')
        product_id = request.GET.get('product_id')

        review = Review.objects.get(id=review_id)
        review.delete()

        reviews_qs = Review.objects.filter(product_id=product_id)
        review_container_html = render_to_string(
            'includes/review_block.html', {
                'reviews_qs': reviews_qs
            }, request=request
        )

        response_data = {
            'message': "Відгук видалено",
            'review_container': review_container_html
        }

        return JsonResponse(response_data)


def recently_viewed(request, product_slug):
    if "recently_viewed" not in request.session:
        request.session["recently_viewed"] = []
        request.session["recently_viewed"].append(product_slug)
    else:
        if product_slug in request.session["recently_viewed"]:
            request.session["recently_viewed"].remove(product_slug)
        request.session["recently_viewed"].insert(0, product_slug)
        if len(request.session["recently_viewed"]) > MAX_RECENT_VIEWED_PRODUCTS:
            del request.session["recently_viewed"][MAX_RECENT_VIEWED_PRODUCTS - 1]
    request.session.modified = True
