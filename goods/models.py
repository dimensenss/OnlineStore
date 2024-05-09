from django.db import models
from django.urls import reverse_lazy
from django.utils.safestring import mark_safe
from mptt.fields import TreeForeignKey
from mptt.models import MPTTModel
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill


class Product(models.Model):
    title = models.CharField(max_length=255, verbose_name='Назва')
    sku = models.CharField(max_length=255, verbose_name='Артикул', blank=True, null=True, unique=True)
    slug = models.SlugField(max_length=255, unique=True, db_index=True, verbose_name="URL")
    content = models.TextField(blank=True, verbose_name='Контент')
    price = models.IntegerField(default=0, verbose_name='Ціна')
    discount = models.IntegerField(default=0, verbose_name='Ціна зі знижкою')
    quantity = models.PositiveIntegerField(default=1, verbose_name='Кількість')
    brand = models.ForeignKey('Brand', blank=True, null=True, on_delete=models.SET_NULL, related_name='brand',
                              verbose_name='Бренд')
    time_create = models.DateTimeField(auto_now_add=True, verbose_name='Час створення')
    time_update = models.DateTimeField(auto_now=True, verbose_name="Час оновлення")
    is_published = models.BooleanField(default=True, verbose_name='Опубліковано')
    cat = models.ForeignKey('Category', models.SET_DEFAULT, default=0, related_name='products',
                            verbose_name='Категорія')

    def calculate_sell_price(self):
        return self.discount if self.discount else self.price

    def load_preview(self):
        return self.images.first().image.url

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse_lazy('goods:product', kwargs={'product_slug': self.slug})

    def get_html_image(self):
        return mark_safe(f"<img src = '{self.images.first().image.url}' width=100 >")

    def display_id(self):
        return self.sku if self.sku else f"{self.id:05}"

    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товар'
        ordering = ['-time_create', 'title']

class ProductAttributeQS(models.QuerySet):
    ...

class ProductAttribute(models.Model):
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='attributes')
    name = models.CharField(blank=True, null=True, verbose_name='name')
    value = models.CharField(max_length=100, blank=True, verbose_name='value')

    class Meta:
        verbose_name = 'Атрібут'
        verbose_name_plural = 'Атрібути'

    def __str__(self):
        return self.name

    objects = ProductAttributeQS.as_manager()


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
        slug = '/'.join([ancestor.slug for ancestor in self.get_ancestors(include_self=True)])
        return reverse_lazy('goods:catalog', kwargs={'cat_slug': slug})


class ProductImage(models.Model):
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='images')
    image = ProcessedImageField(
        upload_to="product_images/%Y/%m/%d/",
        processors=[ResizeToFill(800, 800)],
        format='JPEG',
        options={'quality': 90}
    )

    def get_html_image(self):
        return mark_safe(f"<img src = '{self.image.url}' width=100 >")

    class Meta:
        verbose_name = 'Фотографія'
        verbose_name_plural = 'Фотографії'


class Brand(models.Model):
    name = models.CharField(max_length=255, verbose_name='Назва бренду')

    class Meta:
        verbose_name = 'Бренд'
        verbose_name_plural = 'Бренди'

    def __str__(self):
        return self.name