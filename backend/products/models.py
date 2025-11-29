from django.db import models
from django.core.exceptions import ValidationError


class Product(models.Model):
    """
    مدل محصول
    """
    CATEGORY_CHOICES = [
        ('baby', 'نوزاد'),
        ('girl', 'دخترانه'),
        ('boy', 'پسرانه'),
    ]
    
    SEASON_CHOICES = [
        ('winter', 'زمستان'),
        ('spring', 'بهار'),
        ('summer', 'تابستان'),
        ('fall', 'پاییز'),
    ]
    
    name = models.CharField(max_length=200, verbose_name='نام محصول')
    product_code = models.CharField(
        max_length=50,
        unique=True,
        blank=True,
        null=True,
        verbose_name='کد محصول'
    )
    description = models.TextField(verbose_name='توضیحات')
    price = models.DecimalField(
        max_digits=10,
        decimal_places=0,
        verbose_name='قیمت (تومان)'
    )
    category = models.CharField(
        max_length=10,
        choices=CATEGORY_CHOICES,
        verbose_name='دسته‌بندی'
    )
    season = models.CharField(
        max_length=10,
        choices=SEASON_CHOICES,
        verbose_name='فصل'
    )
    image = models.ImageField(
        upload_to='products/',
        verbose_name='تصویر محصول'
    )
    is_active = models.BooleanField(default=True, verbose_name='فعال')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ به‌روزرسانی')

    class Meta:
        verbose_name = 'محصول'
        verbose_name_plural = 'محصولات'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['category', 'season']),
            models.Index(fields=['is_active', '-created_at']),
            models.Index(fields=['category', 'is_active']),
            models.Index(fields=['season', 'is_active']),
            models.Index(fields=['price']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        # تولید کد محصول خودکار اگر وجود نداشته باشد
        if not self.product_code:
            # استفاده از ID برای تولید کد یکتا
            super().save(*args, **kwargs)
            self.product_code = f"PKP-{self.id:05d}"
            super().save(update_fields=['product_code'])
        else:
            super().save(*args, **kwargs)

    @property
    def is_in_stock(self):
        """بررسی موجود بودن محصول - چک کردن موجودی تمام variants"""
        return self.variants.filter(stock__gt=0).exists()
    
    @property
    def min_price(self):
        """کمترین قیمت از بین variants"""
        variants = self.variants.all()
        if variants.exists():
            return min(v.price for v in variants)
        return self.price
    
    @property
    def max_price(self):
        """بیشترین قیمت از بین variants"""
        variants = self.variants.all()
        if variants.exists():
            return max(v.price for v in variants)
        return self.price
    
    @property
    def available_colors(self):
        """لیست رنگ‌های موجود"""
        return list(self.variants.values_list('color', flat=True).distinct())
    
    @property
    def available_sizes(self):
        """لیست سایزهای موجود"""
        return list(self.variants.values_list('size', flat=True).distinct())

    def get_category_display_fa(self):
        """نمایش دسته‌بندی به فارسی"""
        return dict(self.CATEGORY_CHOICES).get(self.category, self.category)

    def get_season_display_fa(self):
        """نمایش فصل به فارسی"""
        return dict(self.SEASON_CHOICES).get(self.season, self.season)


class ProductVariant(models.Model):
    """
    مدل تنوع محصول (رنگ و سایز مختلف)
    """
    COLOR_CHOICES = [
        ('red', 'قرمز'),
        ('blue', 'آبی'),
        ('green', 'سبز'),
        ('yellow', 'زرد'),
        ('pink', 'صورتی'),
        ('purple', 'بنفش'),
        ('orange', 'نارنجی'),
        ('white', 'سفید'),
        ('black', 'مشکی'),
        ('gray', 'خاکستری'),
        ('brown', 'قهوه‌ای'),
        ('navy', 'سرمه‌ای'),
    ]
    
    SIZE_CHOICES = [
        ('newborn', 'نوزاد'),
        ('0-3m', '۰-۳ ماه'),
        ('3-6m', '۳-۶ ماه'),
        ('6-9m', '۶-۹ ماه'),
        ('9-12m', '۹-۱۲ ماه'),
        ('12-18m', '۱۲-۱۸ ماه'),
        ('18-24m', '۱۸-۲۴ ماه'),
        ('2y', '۲ سال'),
        ('3y', '۳ سال'),
        ('4y', '۴ سال'),
        ('5y', '۵ سال'),
        ('6y', '۶ سال'),
        ('7y', '۷ سال'),
        ('8y', '۸ سال'),
        ('9y', '۹ سال'),
        ('10y', '۱۰ سال'),
        ('11y', '۱۱ سال'),
        ('12y', '۱۲ سال'),
    ]
    
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='variants',
        verbose_name='محصول'
    )
    color = models.CharField(
        max_length=20,
        choices=COLOR_CHOICES,
        verbose_name='رنگ'
    )
    size = models.CharField(
        max_length=20,
        choices=SIZE_CHOICES,
        verbose_name='سایز'
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=0,
        verbose_name='قیمت (تومان)',
        help_text='اگر خالی باشد، قیمت محصول اصلی استفاده می‌شود'
    )
    stock = models.PositiveIntegerField(default=0, verbose_name='موجودی')
    sku = models.CharField(
        max_length=100,
        unique=True,
        blank=True,
        null=True,
        verbose_name='کد محصول'
    )
    image = models.ImageField(
        upload_to='products/variants/',
        blank=True,
        null=True,
        verbose_name='تصویر (اختیاری)'
    )
    is_active = models.BooleanField(default=True, verbose_name='فعال')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    
    class Meta:
        verbose_name = 'تنوع محصول'
        verbose_name_plural = 'تنوع محصولات'
        unique_together = ['product', 'color', 'size']
        ordering = ['product', 'color', 'size']
    
    def __str__(self):
        return f"{self.product.name} - {self.get_color_display()} - {self.get_size_display()}"
    
    @property
    def is_in_stock(self):
        """بررسی موجود بودن"""
        return self.stock > 0
    
    def clean(self):
        """اعتبارسنجی"""
        if self.stock < 0:
            raise ValidationError('موجودی نمی‌تواند منفی باشد')
    
    def save(self, *args, **kwargs):
        # اگر قیمت تنظیم نشده، از قیمت محصول اصلی استفاده کن
        if not self.price:
            self.price = self.product.price
        # تولید SKU خودکار
        if not self.sku:
            self.sku = f"{self.product.id}-{self.color}-{self.size}"
        super().save(*args, **kwargs)
