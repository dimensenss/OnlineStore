from django.http import HttpResponseNotFound, HttpResponse
from django.shortcuts import render

# Create your views here.
def main_page(request):
    return render(request, 'goods/main_page.html')

def page_not_found(request, exception):
    return HttpResponseNotFound('<h1>Сторінка не знайдена</h1>')