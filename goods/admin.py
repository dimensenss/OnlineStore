from django_ckeditor_5.widgets import CKEditor5Widget
from dal import autocomplete
from django.contrib import admin
from django.db import models
from django.db.models import Count
from django.utils.safestring import mark_safe
from django_mptt_admin.admin import DjangoMpttAdmin
from django import forms
from goods.models import Product, Category, ProductImage, ProductAttribute, Brand, Review, AttributesValues, \
    AttributesNames


class ProductImagesInline(admin.TabularInline):
    model = ProductImage
    readonly_fields = ['get_html_image']
    extra = 1


class ProductAttributeForm(forms.ModelForm):
    class Meta:
        model = ProductAttribute
        fields = '__all__'
        widgets = {
            'atr_name': autocomplete.ModelSelect2(url='attribute-name-autocomplete'),
            'value': autocomplete.ModelSelect2(url='attribute-value-autocomplete'),
        }


class ProductAttributeInline(admin.TabularInline):
    model = ProductAttribute
    form = ProductAttributeForm
    extra = 0


class ProductAdminForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = '__all__'
        widgets = {
            'content': CKEditor5Widget(),
            'cat': autocomplete.ModelSelect2(url='category-autocomplete'),
            'brand': autocomplete.ModelSelect2(url='brands-autocomplete'),
        }



class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm
    inlines = [ProductAttributeInline, ProductImagesInline]
    list_display = ('id', 'get_html_image', 'title', 'cat', 'time_create', 'is_published', 'is_available')
    list_display_links = ('id', 'title')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('id', 'title', 'content')
    list_editable = ('is_published',)
    list_filter = ('is_published', 'time_create', 'cat', 'is_available')
    readonly_fields = ('get_html_image',)
    fieldsets = [
        (None, {'fields': ['get_html_image', 'title', 'sku', 'slug', 'content', 'price', 'discount', 'quantity',
                           'guarantee', 'cat', 'brand',
                           'is_published']})
    ]



class CategoryAdmin(DjangoMpttAdmin):
    list_display = ('id', 'title', 'slug', 'count_products')
    list_display_links = ('id', 'title')
    readonly_fields = ('count_products',)
    search_fields = ('title',)
    prepopulated_fields = {'slug': ('title',)}

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.annotate(product_count=Count('products'))
        return queryset

    def count_products(self, obj):
        return obj.product_count

    count_products.short_description = 'Кількість товарів'


# Register your models and admin classes using the admin.site.register() method outside of class definitions
admin.site.register(Product, ProductAdmin)
admin.site.register(Category, CategoryAdmin)


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'text')


# @admin.register(ProductAttribute)
# class ProductAttributeAdmin(admin.ModelAdmin):
#     list_display = ('id', 'atr_name', 'value')

@admin.register(AttributesValues)
class AttributesValuesAdmin(admin.ModelAdmin):
    list_display = ('id', 'name',)


@admin.register(AttributesNames)
class AttributesNamesAdmin(admin.ModelAdmin):
    list_display = ('id', 'name',)
