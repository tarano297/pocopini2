"""
Custom Validators for Enhanced Security
"""
import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from PIL import Image
import magic
import os


def validate_iranian_phone(value):
    """اعتبارسنجی شماره تلفن ایرانی"""
    # شماره موبایل: 09xxxxxxxxx
    mobile_pattern = r'^09\d{9}$'
    # شماره ثابت تهران: 021xxxxxxxx
    landline_pattern = r'^0\d{2,3}\d{8}$'
    
    if not (re.match(mobile_pattern, value) or re.match(landline_pattern, value)):
        raise ValidationError(
            _('شماره تلفن وارد شده معتبر نیست. فرمت صحیح: 09xxxxxxxxx یا 021xxxxxxxx')
        )


def validate_iranian_postal_code(value):
    """اعتبارسنجی کد پستی ایرانی"""
    # کد پستی ایران: 10 رقم
    postal_pattern = r'^\d{10}$'
    
    if not re.match(postal_pattern, value):
        raise ValidationError(
            _('کد پستی باید 10 رقم باشد.')
        )


def validate_iranian_national_code(value):
    """اعتبارسنجی کد ملی ایرانی"""
    if not re.match(r'^\d{10}$', value):
        raise ValidationError(_('کد ملی باید 10 رقم باشد.'))
    
    # الگوریتم اعتبارسنجی کد ملی
    check = int(value[9])
    s = sum(int(value[i]) * (10 - i) for i in range(9)) % 11
    
    if not ((s < 2 and check == s) or (s >= 2 and check == 11 - s)):
        raise ValidationError(_('کد ملی وارد شده معتبر نیست.'))


def validate_no_special_chars(value):
    """جلوگیری از کاراکترهای خاص خطرناک"""
    dangerous_chars = ['<', '>', '"', "'", '&', ';', '(', ')', '{', '}', '[', ']']
    
    for char in dangerous_chars:
        if char in value:
            raise ValidationError(
                _('استفاده از کاراکترهای خاص مجاز نیست.')
            )


def validate_safe_filename(value):
    """اعتبارسنجی نام فایل برای جلوگیری از Path Traversal"""
    if '..' in value or '/' in value or '\\' in value:
        raise ValidationError(
            _('نام فایل نامعتبر است.')
        )
    
    # فقط حروف، اعداد، خط تیره و آندرلاین
    if not re.match(r'^[\w\-. ]+$', value):
        raise ValidationError(
            _('نام فایل فقط می‌تواند شامل حروف، اعداد، خط تیره و آندرلاین باشد.')
        )


def validate_image_file(file):
    """اعتبارسنجی فایل تصویر"""
    # بررسی اندازه فایل (حداکثر 5MB)
    max_size = 5 * 1024 * 1024  # 5MB
    if file.size > max_size:
        raise ValidationError(
            _('حجم فایل نباید بیشتر از 5 مگابایت باشد.')
        )
    
    # بررسی پسوند فایل
    allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    ext = os.path.splitext(file.name)[1].lower()
    if ext not in allowed_extensions:
        raise ValidationError(
            _('فرمت فایل مجاز نیست. فرمت‌های مجاز: JPG, PNG, GIF, WEBP')
        )
    
    # بررسی MIME type واقعی فایل
    try:
        file_type = magic.from_buffer(file.read(1024), mime=True)
        file.seek(0)  # بازگشت به ابتدای فایل
        
        allowed_mime_types = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp'
        ]
        
        if file_type not in allowed_mime_types:
            raise ValidationError(
                _('نوع فایل معتبر نیست.')
            )
    except:
        # اگر python-magic نصب نباشد، از PIL استفاده می‌کنیم
        try:
            img = Image.open(file)
            img.verify()
            file.seek(0)
        except:
            raise ValidationError(
                _('فایل آپلود شده یک تصویر معتبر نیست.')
            )


def validate_strong_password(value):
    """اعتبارسنجی رمز عبور قوی"""
    if len(value) < 10:
        raise ValidationError(
            _('رمز عبور باید حداقل 10 کاراکتر باشد.')
        )
    
    # حداقل یک حرف بزرگ
    if not re.search(r'[A-Z]', value):
        raise ValidationError(
            _('رمز عبور باید حداقل یک حرف بزرگ داشته باشد.')
        )
    
    # حداقل یک حرف کوچک
    if not re.search(r'[a-z]', value):
        raise ValidationError(
            _('رمز عبور باید حداقل یک حرف کوچک داشته باشد.')
        )
    
    # حداقل یک عدد
    if not re.search(r'\d', value):
        raise ValidationError(
            _('رمز عبور باید حداقل یک عدد داشته باشد.')
        )
    
    # حداقل یک کاراکتر خاص
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
        raise ValidationError(
            _('رمز عبور باید حداقل یک کاراکتر خاص داشته باشد.')
        )


def validate_url_safe(value):
    """اعتبارسنجی URL برای جلوگیری از حملات"""
    # فقط URL های http و https
    if not value.startswith(('http://', 'https://')):
        raise ValidationError(
            _('URL باید با http:// یا https:// شروع شود.')
        )
    
    # جلوگیری از javascript: و data: URLs
    dangerous_protocols = ['javascript:', 'data:', 'vbscript:', 'file:']
    for protocol in dangerous_protocols:
        if protocol in value.lower():
            raise ValidationError(
                _('URL نامعتبر است.')
            )


def validate_no_sql_injection(value):
    """بررسی الگوهای SQL Injection"""
    sql_patterns = [
        r'union\s+select',
        r'drop\s+table',
        r'insert\s+into',
        r'delete\s+from',
        r'update\s+\w+\s+set',
        r'exec\s*\(',
        r'execute\s*\(',
        r'--',
        r'/\*',
        r'\*/',
        r'xp_',
        r'sp_',
    ]
    
    value_lower = value.lower()
    for pattern in sql_patterns:
        if re.search(pattern, value_lower):
            raise ValidationError(
                _('ورودی نامعتبر است.')
            )


def validate_no_xss(value):
    """بررسی الگوهای XSS"""
    xss_patterns = [
        r'<script',
        r'javascript:',
        r'onerror\s*=',
        r'onload\s*=',
        r'onclick\s*=',
        r'<iframe',
        r'<object',
        r'<embed',
        r'eval\s*\(',
        r'expression\s*\(',
    ]
    
    value_lower = value.lower()
    for pattern in xss_patterns:
        if re.search(pattern, value_lower):
            raise ValidationError(
                _('ورودی نامعتبر است.')
            )
