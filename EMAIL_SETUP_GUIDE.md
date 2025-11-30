# راهنمای راه‌اندازی ایمیل سرور

## مراحل راه‌اندازی

### 1. انتخاب سرویس ایمیل

#### گزینه 1: Gmail (توصیه می‌شود برای تست)

1. به Gmail خود وارد شوید
2. به [Google Account Security](https://myaccount.google.com/security) بروید
3. "2-Step Verification" را فعال کنید
4. به [App Passwords](https://myaccount.google.com/apppasswords) بروید
5. یک App Password جدید بسازید (نام: Pokopini)
6. رمز 16 رقمی را کپی کنید

#### گزینه 2: سرویس‌های ایرانی

**MailFa:**
- ثبت‌نام در [mailfa.net](https://mailfa.net)
- دریافت اطلاعات SMTP از پنل کاربری

**دیگر سرویس‌ها:**
- Mail.ir
- Parsmail
- Mailfa

### 2. تنظیم فایل .env

در پوشه `backend` یک فایل `.env` بسازید:

```bash
# کپی کردن فایل نمونه
cp .env.example .env
```

محتوای فایل `.env`:

```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here

# Email Configuration - Gmail
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-16-digit-app-password
DEFAULT_FROM_EMAIL=noreply@pokopini.com
ADMIN_EMAIL=admin@pokopini.com
```

### 3. نصب پکیج python-decouple (اگر نصب نیست)

```bash
cd backend
pip install python-decouple
```

### 4. به‌روزرسانی settings.py

فایل `backend/pokopini/settings.py` را ویرایش کنید و در ابتدا اضافه کنید:

```python
from decouple import config

# در قسمت Email Configuration:
EMAIL_BACKEND = config('EMAIL_BACKEND', default='django.core.mail.backends.console.EmailBackend')
EMAIL_HOST = config('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='noreply@pokopini.com')
ADMIN_EMAIL = config('ADMIN_EMAIL', default='admin@pokopini.com')
```

### 5. تست ارسال ایمیل

#### روش 1: از Django Shell

```bash
cd backend
python manage.py shell
```

```python
from django.core.mail import send_mail
from django.conf import settings

send_mail(
    'تست ایمیل',
    'این یک پیام تستی است',
    settings.DEFAULT_FROM_EMAIL,
    [settings.ADMIN_EMAIL],
    fail_silently=False,
)
```

#### روش 2: از API

```bash
curl -X POST http://localhost:8000/api/contact/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "علی احمدی",
    "email": "test@example.com",
    "subject": "تست",
    "message": "این یک پیام تستی است"
  }'
```

### 6. استفاده در کد

#### ارسال ایمیل تماس با ما:

```python
from pokopini.email_utils import send_contact_email

send_contact_email(
    name="علی احمدی",
    email="ali@example.com",
    subject="سوال درباره محصول",
    message="سلام، می‌خواستم درباره محصول X بپرسم..."
)
```

#### ارسال ایمیل تایید سفارش:

```python
from pokopini.email_utils import send_order_confirmation_email

send_order_confirmation_email(order)
```

#### ارسال ایمیل تغییر وضعیت:

```python
from pokopini.email_utils import send_order_status_update_email

send_order_status_update_email(order)
```

## تنظیمات مختلف سرویس‌ها

### Gmail
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
```

### Yahoo
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
```

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
```

### MailFa (ایرانی)
```env
EMAIL_HOST=smtp.mailfa.net
EMAIL_PORT=587
EMAIL_USE_TLS=True
```

### SendGrid
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=your-sendgrid-api-key
```

## حالت توسعه (Development)

برای تست بدون ارسال ایمیل واقعی، از Console Backend استفاده کنید:

```env
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

ایمیل‌ها در کنسول/ترمینال نمایش داده می‌شوند.

## حالت فایل (File Backend)

برای ذخیره ایمیل‌ها در فایل:

```env
EMAIL_BACKEND=django.core.mail.backends.filebased.EmailBackend
EMAIL_FILE_PATH=/tmp/app-emails
```

## عیب‌یابی

### خطای Authentication Failed

- مطمئن شوید App Password را درست کپی کرده‌اید
- فاصله اضافی در رمز نباشد
- 2-Step Verification فعال باشد

### خطای Connection Refused

- پورت و هاست را چک کنید
- فایروال را بررسی کنید
- VPN را خاموش کنید

### ایمیل ارسال نمی‌شود

- لاگ‌های Django را چک کنید
- `fail_silently=False` را تنظیم کنید تا خطا نمایش داده شود
- از Django Shell تست کنید

## امنیت

⚠️ **هرگز فایل `.env` را commit نکنید!**

```bash
# اضافه کردن به .gitignore
echo ".env" >> .gitignore
```

## استفاده در Production

برای production از متغیرهای محیطی استفاده کنید:

```bash
export EMAIL_HOST_USER=your-email@gmail.com
export EMAIL_HOST_PASSWORD=your-password
```

یا در Docker Compose:

```yaml
environment:
  - EMAIL_HOST_USER=your-email@gmail.com
  - EMAIL_HOST_PASSWORD=your-password
```
