from django.db import models
from django.urls import reverse_lazy
from mptt.fields import TreeForeignKey
from mptt.models import MPTTModel
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill


class Product(models.Model):
    title = models.CharField(max_length=255, verbose_name='Назва')
    sku = models.CharField(max_length=255, verbose_name='Артикул', blank=True, null=True, unique=True)
    slug = models.SlugField(max_length=255, unique=True, db_index=True, verbose_name="URL")
    content = models.TextField(blank=True, verbose_name='Контент')
    price = models.DecimalField(default=0.0, max_digits=7, decimal_places=2, verbose_name='Ціна')
    discount = models.DecimalField(default=0.0, max_digits=7, decimal_places=2, verbose_name='Ціна зі знижкою')
    brand = models.CharField(max_length=255, verbose_name='Бренд')
    time_create = models.DateTimeField(auto_now_add=True, verbose_name='Час створення')
    time_update = models.DateTimeField(auto_now=True, verbose_name="Час оновлення")
    is_published = models.BooleanField(default=True, verbose_name='Опубліковано')
    extra_attributes = models.JSONField(default=dict, blank=True, verbose_name='Додаткові атрибуты')
    cat = models.ForeignKey('Category', models.SET_DEFAULT, default=0, related_name='products',
                            verbose_name='Категорія')


    def calculate_sell_price(self):
        return self.discount if self.discount else self.price

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse_lazy('goods:product', kwargs={'product_slug': self.slug})

    def display_id(self):
        return self.sku if self.sku else f"{self.id:05}"

    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товар'
        ordering = ['-time_create', 'title']


class Category(MPTTModel):
    title = models.CharField(max_length=255, verbose_name='Назва категорії')
    slug = models.SlugField(max_length=255, verbose_name='URL', unique=True)
    parent = TreeForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        db_index=True,
        related_name='children',
        verbose_name='Батьківська категорія'
    )

    class MPTTMeta:
        order_insertion_by = ('title',)

    class Meta:
        verbose_name = 'Категорія'
        verbose_name_plural = 'Категорії'

    def __str__(self):
        return ''.join([ancestor.title + ' > ' for ancestor in self.get_ancestors(include_self=True)])[:-3]

    def get_absolute_url(self):
        # return '/category/'+'/'.join([ancestor.slug for ancestor in self.get_ancestors(include_self=True)])
        slug = '/category/'+'/'.join([ancestor.slug for ancestor in self.get_ancestors(include_self=True)])
        return reverse_lazy('goods:category', kwargs={'cat_slug': slug})


class ProductImage(models.Model):
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='images')
    image = ProcessedImageField(
        upload_to="product_images/%Y/%m/%d/",
        processors=[ResizeToFill(800, 800)],
        format='JPEG',
        options={'quality': 90}
    )

    class Meta:
        verbose_name = 'Фотографія'
        verbose_name_plural = 'Фотографії'