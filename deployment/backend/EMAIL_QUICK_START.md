# راه‌اندازی سریع ایمیل

## 🚀 شروع سریع (5 دقیقه)

### 1. فایل `.env` آماده است ✅

فایل `.env` در پوشه `backend` ساخته شده و با تنظیمات Console Backend آماده است.

### 2. تست سیستم

```bash
cd backend
python test_email.py
```

این اسکریپت:
- ✅ تنظیمات فعلی را نمایش می‌دهد
- ✅ یک ایمیل تستی ارسال می‌کند
- ✅ فرم تماس با ما را تست می‌کند

### 3. حالت فعلی: Console Backend

در حال حاضر ایمیل‌ها در **کنسول** نمایش داده می‌شوند (ارسال واقعی نمی‌شوند).

برای دیدن ایمیل‌ها:
1. سرور Django را اجرا کنید: `python manage.py runserver`
2. از API تماس با ما استفاده کنید
3. ایمیل در کنسول/ترمینال نمایش داده می‌شود

### 4. فعال‌سازی ارسال واقعی (Gmail)

#### مرحله 1: دریافت App Password از Gmail

1. به [Google Account Security](https://myaccount.google.com/security) بروید
2. "2-Step Verification" را فعال کنید
3. به [App Passwords](https://myaccount.google.com/apppasswords) بروید
4. یک App Password بسازید (نام: Pokopini)
5. رمز 16 رقمی را کپی کنید

#### مرحله 2: ویرایش فایل `.env`

فایل `backend/.env` را باز کنید و این خطوط را تغییر دهید:

```env
# این خط را تغییر دهید:
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend

# این خطوط را پر کنید:
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-16-digit-app-password
ADMIN_EMAIL=your-email@gmail.com
```

#### مرحله 3: تست مجدد

```bash
python test_email.py
```

اگر همه چیز درست باشد، ایمیل واقعی دریافت می‌کنید! 🎉

## 📡 API Endpoint

### ارسال پیام تماس با ما

```bash
POST http://localhost:8000/api/contact/
Content-Type: application/json

{
  "name": "علی احمدی",
  "email": "ali@example.com",
  "subject": "سوال درباره محصول",
  "message": "سلام، می‌خواستم بپرسم..."
}
```

### تست با curl

```bash
curl -X POST http://localhost:8000/api/contact/ \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"علی\",\"email\":\"test@test.com\",\"subject\":\"تست\",\"message\":\"سلام\"}"
```

## 🔧 استفاده در کد

### ارسال ایمیل تماس با ما

```python
from pokopini.email_utils import send_contact_email

send_contact_email(
    name="علی احمدی",
    email="ali@example.com",
    subject="سوال",
    message="متن پیام..."
)
```

### ارسال ایمیل تایید سفارش

```python
from pokopini.email_utils import send_order_confirmation_email

send_order_confirmation_email(order)
```

### ارسال ایمیل تغییر وضعیت

```python
from pokopini.email_utils import send_order_status_update_email

send_order_status_update_email(order)
```

### ارسال ایمیل خوش‌آمدگویی

```python
from pokopini.email_utils import send_welcome_email

send_welcome_email(user)
```

## 🌐 صفحه تماس با ما (Frontend)

صفحه React در `frontend/src/pages/ContactPage.js` آماده است.

برای استفاده، آن را به Router اضافه کنید:

```javascript
import ContactPage from './pages/ContactPage';

// در App.js:
<Route path="/contact" element={<ContactPage />} />
```

## 🐛 عیب‌یابی

### ایمیل ارسال نمی‌شود

```bash
# چک کردن تنظیمات
python test_email.py

# چک کردن لاگ‌ها
python manage.py runserver
# و سپس از API استفاده کنید
```

### خطای Authentication

- مطمئن شوید App Password درست است
- فاصله اضافی نباشد
- 2-Step Verification فعال باشد

### خطای Connection

- VPN را خاموش کنید
- فایروال را چک کنید
- پورت 587 باز باشد

## 📚 مستندات کامل

برای اطلاعات بیشتر، فایل `EMAIL_SETUP_GUIDE.md` را مطالعه کنید.

## ✅ چک‌لیست

- [x] فایل `.env` ساخته شد
- [x] تنظیمات ایمیل در `settings.py` اضافه شد
- [x] توابع ارسال ایمیل در `email_utils.py` آماده است
- [x] API endpoint تماس با ما آماده است
- [x] صفحه تماس با ما (React) آماده است
- [x] اسکریپت تست آماده است
- [ ] App Password از Gmail دریافت شود (اختیاری)
- [ ] تست ارسال واقعی انجام شود (اختیاری)

## 🎯 مرحله بعدی

1. اگر فقط می‌خواهید تست کنید، همین الان آماده است! (Console Backend)
2. اگر می‌خواهید ایمیل واقعی بفرستید، App Password بگیرید و `.env` را ویرایش کنید
3. صفحه تماس با ما را به Router اضافه کنید
4. لذت ببرید! 🚀
