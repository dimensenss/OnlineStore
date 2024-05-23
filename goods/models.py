from django.db import models
from django.db.models import Avg
from django.templatetags.static import static
from django.urls import reverse_lazy
from django.utils.safestring import mark_safe
from mptt.fields import TreeForeignKey
from mptt.models import MPTTModel
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill

from users.models import User


class Product(models.Model):
    title = models.CharField(max_length=255, verbose_name='Назва')
    sku = models.CharField(max_length=255, verbose_name='Артикул', blank=True, null=True, unique=True)
    slug = models.SlugField(max_length=255, unique=True, db_index=True, verbose_name="URL")
    content = models.TextField(blank=True, verbose_name='Контент')
    price = models.IntegerField(default=0, verbose_name='Ціна')
    discount = models.IntegerField(default=0, verbose_name='Ціна зі знижкою')
    quantity = models.PositiveIntegerField(default=1, verbose_name='Кількість товару')
    brand = models.ForeignKey('Brand', blank=True, null=True, on_delete=models.SET_NULL, related_name='brand',
                              verbose_name='Бренд')
    guarantee = models.SmallIntegerField(default=0, verbose_name='Гарантія(міс)')
    time_create = models.DateTimeField(auto_now_add=True, verbose_name='Час створення')
    time_update = models.DateTimeField(auto_now=True, verbose_name="Час оновлення")
    is_published = models.BooleanField(default=True, verbose_name='Опубліковано')
    cat = models.ForeignKey('Category', models.SET_DEFAULT, default=0, related_name='products',
                            verbose_name='Категорія')
    sell_price = models.DecimalField(default=0.0, max_digits=7, decimal_places=2, verbose_name='Актуальна ціна')

    def calculate_sell_price(self):
        return self.discount if self.discount else self.price

    def load_preview(self):
        return self.images.first().image.url

    def calculate_rate(self):
        average_rating = self.reviews.aggregate(Avg('rate'))['rate__avg']
        if average_rating is not None:
            return round(average_rating)
        return 0

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse_lazy('goods:product', kwargs={'product_slug': self.slug})

    def get_html_image(self):
        first_image = self.images.first()
        if first_image and first_image.image:
            return mark_safe(f"<img src='{first_image.image.url}' width='100' />")
        else:
            image_url = static('img/NEXUS.svg')
            return mark_safe(f"<img src='{image_url}' width='100' />")

    def display_id(self):
        return self.sku if self.sku else f"{self.id:05}"

    def save(self, *args, **kwargs):
        self.sell_price = self.calculate_sell_price()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товар'
        ordering = ['-time_create', 'title']


class ProductAttributeQS(models.QuerySet):
    ...


class ProductAttribute(models.Model):
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='attributes')
    atr_name = models.ForeignKey('AttributesNames', blank=True, null=True, on_delete=models.SET_NULL,
                                 related_name='atr_name',
                                 verbose_name='Назва')
    value = models.ForeignKey('AttributesValues', blank=True, null=True, on_delete=models.SET_NULL,
                              related_name='value',
                              verbose_name='Значення')

    class Meta:
        verbose_name = 'Атрібут'
        verbose_name_plural = 'Атрібути'

    def __str__(self):
        return self.atr_name.name

    # objects = ProductAttributeQS.as_manager()
    objects = models.Manager()


class AttributesNames(models.Model):
    name = models.CharField(max_length=100, blank=True, verbose_name='value')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Атрибут'
        verbose_name_plural = 'Атрибути'


class AttributesValues(models.Model):
    name = models.CharField(max_length=100, blank=True, verbose_name='value')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Значення атрибута'
        verbose_name_plural = 'Значення атрибутів'


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
        if self.image.url:
            return mark_safe(f"<img src = '{self.image.url}' width=100 >")
        else:
            image_url = static('img/NEXUS.svg')
            return mark_safe(f"<img src = '{image_url}' width=100 >")

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


class Review(models.Model):
    RATING_CHOICES = (
        (1, '1'),
        (2, '2'),
        (3, '3'),
        (4, '4'),
        (5, '5'),
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, default=0, on_delete=models.SET_DEFAULT, related_name='reviews')
    text = models.TextField(verbose_name='Текст', max_length=500)
    date = models.DateTimeField(auto_now_add=True)
    rate = models.PositiveSmallIntegerField(choices=RATING_CHOICES)

    class Meta:
        verbose_name = 'Відгук'
        verbose_name_plural = 'Відгуки'

    def __str__(self):
        return self.text
