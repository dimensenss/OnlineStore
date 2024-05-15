from dal import autocomplete
from django.contrib import admin
from django.db.models import Count
from django.utils.safestring import mark_safe
from django_mptt_admin.admin import DjangoMpttAdmin
from django import forms
from goods.models import Product, Category, ProductImage, ProductAttribute, Brand, Review


class ProductImagesInline(admin.TabularInline):
    model = ProductImage
    readonly_fields = ['get_html_image']
    extra = 1


class ProductAttributeInline(admin.TabularInline):
    model = ProductAttribute
    extra = 0


class ProductAdminForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = '__all__'
        widgets = {
            'cat': autocomplete.ModelSelect2(url='category-autocomplete'),
            'brand': autocomplete.ModelSelect2(url='brands-autocomplete')
        }


class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm
    inlines = [ProductAttributeInline, ProductImagesInline]
    list_display = ('id', 'get_html_image', 'title', 'cat', 'time_create', 'is_published')
    list_display_links = ('id', 'title')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('id', 'title', 'content')
    list_editable = ('is_published',)
    list_filter = ('is_published', 'time_create',)
    readonly_fields = ('get_html_image',)
    fieldsets = [
        (None, {'fields': ['get_html_image', 'title', 'sku', 'slug', 'content', 'price', 'discount', 'quantity', 'cat', 'brand',
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