from django.db.models import Count

from goods.models import Category


def catalog(request):
    cats = Category.objects.all().annotate(len=Count('products')).filter(id__gte=1)
    return {'cats': cats}