# پوکوپینی - بک‌اند

بک‌اند فروشگاه آنلاین پوکوپینی با Django REST Framework

## نصب و راه‌اندازی

### پیش‌نیازها
- Python 3.8 یا بالاتر
- pip

### مراحل نصب

1. ایجاد محیط مجازی:
```bash
python -m venv venv
```

2. فعال‌سازی محیط مجازی:
```bash
# Windows
.\venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. نصب وابستگی‌ها:
```bash
pip install -r requirements.txt
```

4. اجرای مایگریشن‌ها:
```bash
python manage.py migrate
```

5. ایجاد سوپریوزر:
```bash
python manage.py createsuperuser
```

6. اجرای سرور:
```bash
python manage.py runserver
```

## ساختار پروژه

```
backend/
├── pokopini/          # تنظیمات اصلی پروژه
├── accounts/          # مدیریت کاربران و احراز هویت
├── products/          # مدیریت محصولات
├── orders/            # مدیریت سفارشات و سبد خرید
├── reviews/           # مدیریت نظرات
├── media/             # فایل‌های آپلود شده
└── static/            # فایل‌های استاتیک
```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - ثبت‌نام
- `POST /api/auth/login/` - ورود
- `GET /api/auth/profile/` - پروفایل کاربر

### Products
- `GET /api/products/` - لیست محصولات
- `GET /api/products/{id}/` - جزئیات محصول

### Orders
- `GET /api/orders/` - لیست سفارشات
- `POST /api/orders/` - ثبت سفارش

### Reviews
- `GET /api/reviews/` - لیست نظرات
- `POST /api/reviews/` - ثبت نظر

## پنل ادمین

پنل ادمین Django در آدرس زیر در دسترس است:
```
http://localhost:8000/admin/
```
