import django_filters
from dal import autocomplete
from django import forms
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from django.db.models import OuterRef, Subquery, Count, Value
from django_filters import CharFilter

from goods.models import ProductImage, Category, Brand, Product


class DataMixin:
    def get_user_context(self, **kwargs):
        context = kwargs
        return context

    def get_products_with_previews(self, qs):
        first_image_subquery = ProductImage.objects.filter(
            product_id=OuterRef('pk')
        ).order_by('id').values('image')[:1]

        qs = qs.annotate(
            preview=Subquery(first_image_subquery)
        )
        return qs


class BrandsAutocomplete(autocomplete.Select2QuerySetView):
    def get_queryset(self):
        qs = Brand.objects.all()

        if self.q:
            qs = qs.filter(name__istartswith=self.q)

        return qs


class CategoryAutocomplete(autocomplete.Select2QuerySetView):
    def get_queryset(self):
        qs = Category.objects.all()

        if self.q:
            qs = qs.filter(title__istartswith=self.q)

        return qs


class ProductsAutocomplete(autocomplete.Select2QuerySetView):
    def get_queryset(self):
        qs = Product.objects.all()

        if self.q:
            qs = qs.filter(title__istartswith=self.q)

        return qs





class ProductFilter(django_filters.FilterSet):
    title_search = CharFilter(method='title_content_filter', label='Назва складається з', )

    price__gte = django_filters.NumberFilter(
        field_name='sell_price',
        lookup_expr='gte',
        label='Ціна від:',
    )

    price__lte = django_filters.NumberFilter(
        field_name='sell_price',
        lookup_expr='lte',
        label='Ціна до:',
    )

    order_by = django_filters.OrderingFilter(
        fields=(
            ('sell_price', 'sell_price'),
        ),
        field_labels={
            'sell_price': 'Від дешевих до дорогих',
            '-sell_price': 'Від дорогих до дешевих',
        },
        empty_label=None,
    )
    brand = django_filters.ModelMultipleChoiceFilter(
        queryset=Brand.objects.all(),
        widget=forms.CheckboxSelectMultiple
    )

    def title_content_filter(self, queryset, name, value):
        if value.isdigit() and len(value) <= 5:
            return queryset.filter(id=value)

        vector = SearchVector('title', 'content')
        query = SearchQuery(value)
        normalization = Value(2).bitor(Value(4))
        return queryset.annotate(rank=SearchRank(vector, query, normalization=normalization)).filter(
            rank__gt=0).order_by("-rank")

    class Meta:
        model = Product
        fields = {
        }

    def __init__(self, *args, **kwargs):
        super(ProductFilter, self).__init__(*args, **kwargs)
        self.filters['title_search'].field.widget.attrs.update({'class': 'custom-form-control mb-2'})
        self.filters['order_by'].field.widget.attrs.update({'class': 'custom-form-control mb-2'})
        self.filters['price__gte'].field.widget.attrs.update({'class': 'custom-form-control mb-2 price_input'})
        self.filters['price__lte'].field.widget.attrs.update({'class': 'custom-form-control mb-2 price_input'})