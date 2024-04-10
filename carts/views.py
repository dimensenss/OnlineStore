from django.http import JsonResponse
from django.shortcuts import render, redirect

# Create your views here.
from django.template.loader import render_to_string
from django.urls import reverse_lazy

from carts.models import Cart
from carts.utils import get_user_carts
from goods.models import Product


def cart_add(request):
    product_id = request.POST.get('product_id')
    is_order = request.POST.get('is_order')

    product = Product.objects.get(id=product_id)

    if request.user.is_authenticated:
        carts = Cart.objects.filter(user=request.user, product=product)

        if carts.exists():
            cart = carts[0]
            if cart:
                cart.quantity += 1
                cart.save()
        else:
            Cart.objects.create(user=request.user, product=product, quantity=1)

    else:
        carts = Cart.objects.filter(session_key=request.session.session_key, product=product)

        if carts.exists():
            cart = carts[0]
            if cart:
                cart.quantity += 1
                cart.save()
        else:
            Cart.objects.create(session_key=request.session.session_key, product=product, quantity=1)

    user_carts = get_user_carts(request)

    if is_order == "true":
        create_order_url = reverse_lazy('orders:create_order')
    else:
        create_order_url = None

    cart_items_html = render_to_string(
        'carts/includes/included_cart.html', {'carts': user_carts, }, request=request
    )
    response_data = {
        'message': 'Товар додано у кошик',
        'cart_items_html' : cart_items_html,
        'create_order_url': create_order_url
    }

    return JsonResponse(response_data)


def cart_change(request):
    cart_id = request.POST.get('cart_id')
    quantity = request.POST.get('quantity')

    cart = Cart.objects.get(id=cart_id)
    cart.quantity = quantity
    cart.save()

    user_carts = get_user_carts(request)
    cart_items_html = render_to_string(
        'carts/includes/included_cart.html', {'carts': user_carts}, request=request
    )
    response_data = {
        'cart_items_html': cart_items_html,
    }

    return JsonResponse(response_data)

def cart_remove(request):
    cart_id = request.POST.get('cart_id')

    cart = Cart.objects.get(id=cart_id)
    quantity_deleted = cart.quantity
    cart.delete()

    user_carts = get_user_carts(request)
    cart_items_html = render_to_string(
        'carts/includes/included_cart.html', {'carts': user_carts}, request=request
    )
    response_data = {
        'quantity_deleted':quantity_deleted,
        'message': 'Товар(и) видалено',
        'cart_items_html': cart_items_html,
    }

    return JsonResponse(response_data)