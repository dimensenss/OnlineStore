from django.contrib import admin
from django.db.models import Count
from django_mptt_admin.admin import DjangoMpttAdmin

from goods.models import Product, Category, ProductImage, ProductAttribute


class ProductImagesInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductAttributeInline(admin.TabularInline):
    model = ProductAttribute
    extra = 0

class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductAttributeInline, ProductImagesInline]
    list_display = ('id', 'title', 'time_create', 'is_published')
    list_display_links = ('id', 'title')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('id', 'title', 'content')
    list_editable = ('is_published',)
    list_filter = ('is_published', 'time_create', )

    fieldsets = [
        (None, {'fields': ['title', 'sku', 'slug', 'content', 'price', 'discount', 'quantity', 'brand', 'cat', 'is_published']})
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
