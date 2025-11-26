from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    مدل کاربر سفارشی با فیلد شماره تلفن
    """
    phone_number = models.CharField(
        max_length=11,
        unique=True,
        null=True,
        blank=True,
        verbose_name='شماره تلفن'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ به‌روزرسانی')

    class Meta:
        verbose_name = 'کاربر'
        verbose_name_plural = 'کاربران'

    def __str__(self):
        return self.username


class Address(models.Model):
    """
    مدل آدرس کاربر
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='addresses',
        verbose_name='کاربر'
    )
    full_name = models.CharField(max_length=100, verbose_name='نام و نام خانوادگی')
    phone_number = models.CharField(max_length=11, verbose_name='شماره تلفن')
    province = models.CharField(max_length=50, verbose_name='استان')
    city = models.CharField(max_length=50, verbose_name='شهر')
    postal_code = models.CharField(max_length=10, verbose_name='کد پستی')
    address_line = models.TextField(verbose_name='آدرس کامل')
    is_default = models.BooleanField(default=False, verbose_name='آدرس پیش‌فرض')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')

    class Meta:
        verbose_name = 'آدرس'
        verbose_name_plural = 'آدرس‌ها'
        ordering = ['-is_default', '-created_at']

    def __str__(self):
        return f"{self.full_name} - {self.city}"

    def save(self, *args, **kwargs):
        # اگر این آدرس به عنوان پیش‌فرض انتخاب شده، بقیه آدرس‌های کاربر را غیرپیش‌فرض کن
        if self.is_default:
            Address.objects.filter(user=self.user, is_default=True).update(is_default=False)
        super().save(*args, **kwargs)
