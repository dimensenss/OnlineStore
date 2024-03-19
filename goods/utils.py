from django.db.models import OuterRef, Subquery

from goods.models import ProductImage





class DataMixin:
    paginate_by = 3

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

