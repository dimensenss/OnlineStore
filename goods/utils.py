from dal import autocomplete
from django.db.models import OuterRef, Subquery, Count

from goods.models import ProductImage, Category, Brand


class DataMixin:
    def get_user_context(self, **kwargs):
        context = kwargs
        context['cats'] = Category.objects.all().annotate(len=Count('products'))
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
