from django.db import models
from django.conf import settings
from products.models import Product
from accounts.models import Address


class Cart(models.Model):
    """
    مدل سبد خرید
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cart',
        verbose_name='کاربر'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ به‌روزرسانی')

    class Meta:
        verbose_name = 'سبد خرید'
        verbose_name_plural = 'سبدهای خرید'

    def __str__(self):
        return f"سبد خرید {self.user.username}"

    @property
    def total_price(self):
        """محاسبه قیمت کل سبد خرید"""
        return sum(item.subtotal for item in self.items.all())

    @property
    def items_count(self):
        """تعداد کل آیتم‌های سبد"""
        return sum(item.quantity for item in self.items.all())


class CartItem(models.Model):
    """
    مدل آیتم سبد خرید
    """
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name='سبد خرید'
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        verbose_name='محصول'
    )
    quantity = models.PositiveIntegerField(default=1, verbose_name='تعداد')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ افزودن')

    class Meta:
        verbose_name = 'آیتم سبد خرید'
        verbose_name_plural = 'آیتم‌های سبد خرید'
        unique_together = ['cart', 'product']

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"

    @property
    def subtotal(self):
        """محاسبه قیمت کل این آیتم"""
        return self.product.price * self.quantity


class Order(models.Model):
    """
    مدل سفارش
    """
    STATUS_CHOICES = [
        ('pending', 'در انتظار'),
        ('processing', 'در حال پردازش'),
        ('shipped', 'ارسال شده'),
        ('delivered', 'تحویل داده شده'),
        ('cancelled', 'لغو شده'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders',
        verbose_name='کاربر'
    )
    address = models.ForeignKey(
        Address,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name='آدرس'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='وضعیت'
    )
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=0,
        verbose_name='قیمت کل (تومان)'
    )
    shipping_method = models.CharField(
        max_length=20,
        choices=[('standard', 'پست عادی'), ('express', 'پست پیشتاز')],
        default='standard',
        verbose_name='روش ارسال'
    )
    shipping_cost = models.DecimalField(
        max_digits=10,
        decimal_places=0,
        default=0,
        verbose_name='هزینه ارسال (تومان)'
    )
    
    # فیلدهای پرداخت
    payment_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'در انتظار پرداخت'),
            ('paid', 'پرداخت شده'),
            ('failed', 'پرداخت ناموفق'),
            ('refunded', 'بازگشت داده شده'),
        ],
        default='pending',
        verbose_name='وضعیت پرداخت'
    )
    payment_token = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name='توکن پرداخت'
    )
    payment_ref_id = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name='شماره پیگیری پرداخت'
    )
    payment_date = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='تاریخ پرداخت'
    )
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ثبت')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ به‌روزرسانی')

    class Meta:
        verbose_name = 'سفارش'
        verbose_name_plural = 'سفارشات'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return f"سفارش #{self.id} - {self.user.username}"

    def get_status_display_fa(self):
        """نمایش وضعیت به فارسی"""
        return dict(self.STATUS_CHOICES).get(self.status, self.status)


class OrderItem(models.Model):
    """
    مدل آیتم سفارش
    """
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name='سفارش'
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        verbose_name='محصول'
    )
    quantity = models.PositiveIntegerField(default=1, verbose_name='تعداد')
    price = models.DecimalField(
        max_digits=10,
        decimal_places=0,
        verbose_name='قیمت در زمان خرید (تومان)'
    )

    class Meta:
        verbose_name = 'آیتم سفارش'
        verbose_name_plural = 'آیتم‌های سفارش'

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"

    @property
    def subtotal(self):
        """محاسبه قیمت کل این آیتم"""
        return self.price * self.quantity
