from django.db.models import F

from carts.models import Cart


def get_user_carts(request):
    if request.user.is_authenticated:
        return Cart.objects.filter(user=request.user).order_by('id').select_related('product').annotate(
            product_slug=F("product__slug"),
        )

    if not request.session.session_key:
        request.session.create()

    return Cart.objects.filter(
        session_key=request.session.session_key).order_by('id').select_related('product').annotate(
        product_slug=F("product__slug"))
