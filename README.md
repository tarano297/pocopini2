# پوکوپینی - فروشگاه آنلاین لباس کودک

فروشگاه آنلاین تخصصی لباس کودک با پشتیبانی کامل از زبان فارسی و تقویم شمسی.

## ویژگی‌ها

### بک‌اند (Django REST Framework)
- ✅ سیستم احراز هویت کامل با JWT
- ✅ مدیریت محصولات با دسته‌بندی (نوزاد، دخترانه، پسرانه)
- ✅ فیلتر بر اساس فصل (زمستان، بهار، تابستان، پاییز)
- ✅ سیستم سبد خرید و ثبت سفارش
- ✅ مدیریت آدرس‌های کاربر
- ✅ سیستم نظرات و امتیازدهی
- ✅ پنل ادمین فارسی
- ✅ API های RESTful کامل

### فرانت‌اند (React)
- ✅ طراحی واکنش‌گرا با Tailwind CSS
- ✅ پشتیبانی کامل از RTL و فارسی
- ✅ فونت فارسی Vazir
- ✅ تاریخ و اعداد شمسی
- ✅ سیستم احراز هویت
- ✅ مدیریت سبد خرید
- ✅ صفحات محصولات با فیلتر پیشرفته
- ✅ پروفایل کاربر کامل
- ✅ مدیریت خطا و UX بهینه

### بهینه‌سازی‌ها
- ✅ Lazy loading تصاویر
- ✅ Code splitting
- ✅ Caching با Redis
- ✅ Database optimization
- ✅ Error boundary
- ✅ Toast notifications
- ✅ Retry mechanism

## نصب و راه‌اندازی

### پیش‌نیازها
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+

### روش اول: Docker (پیشنهادی)

```bash
# کلون کردن پروژه
git clone https://github.com/your-username/pokopini-shop.git
cd pokopini-shop

# کپی کردن فایل environment
cp .env.example .env

# ویرایش متغیرهای محیطی
nano .env

# اجرای پروژه با Docker
docker-compose up -d

# ایجاد superuser
docker-compose exec backend python manage.py createsuperuser
```

### روش دوم: نصب دستی

#### بک‌اند
```bash
cd backend

# ایجاد virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# یا
venv\Scripts\activate  # Windows

# نصب وابستگی‌ها
pip install -r requirements.txt

# تنظیم پایگاه داده
python manage.py migrate

# ایجاد superuser
python manage.py createsuperuser

# جمع‌آوری فایل‌های استاتیک
python manage.py collectstatic

# اجرای سرور
python manage.py runserver
```

#### فرانت‌اند
```bash
cd frontend

# نصب وابستگی‌ها
npm install

# اجرای سرور توسعه
npm start

# یا ساخت برای production
npm run build
```

## ساختار پروژه

```
pokopini-shop/
├── backend/                 # Django REST Framework
│   ├── pokopini/           # تنظیمات اصلی
│   ├── accounts/           # مدیریت کاربران
│   ├── products/           # مدیریت محصولات
│   ├── orders/             # مدیریت سفارشات
│   ├── reviews/            # سیستم نظرات
│   ├── media/              # فایل‌های آپلود شده
│   └── requirements.txt    # وابستگی‌های Python
│
├── frontend/               # React Application
│   ├── public/             # فایل‌های عمومی
│   ├── src/
│   │   ├── components/     # کامپوننت‌های مشترک
│   │   ├── pages/          # صفحات اصلی
│   │   ├── contexts/       # Context API
│   │   ├── services/       # سرویس‌های API
│   │   ├── utils/          # توابع کمکی
│   │   └── hooks/          # Custom hooks
│   └── package.json        # وابستگی‌های Node.js
│
├── docker-compose.yml      # Docker Compose
├── .env.example           # نمونه متغیرهای محیطی
└── README.md              # این فایل
```

## API Documentation

### Authentication
- `POST /api/auth/register/` - ثبت‌نام
- `POST /api/auth/login/` - ورود
- `GET /api/auth/profile/` - پروفایل کاربر

### Products
- `GET /api/products/` - لیست محصولات
- `GET /api/products/{id}/` - جزئیات محصول
- `GET /api/products/featured/` - محصولات ویژه

### Cart & Orders
- `GET /api/cart/` - سبد خرید
- `POST /api/cart/add/` - افزودن به سبد
- `POST /api/orders/` - ثبت سفارش

### Reviews
- `GET /api/products/{id}/reviews/` - نظرات محصول
- `POST /api/products/{id}/reviews/` - ثبت نظر

## تنظیمات Production

### متغیرهای محیطی
```bash
DEBUG=False
SECRET_KEY=your-production-secret-key
ALLOWED_HOSTS=your-domain.com
DB_PASSWORD=secure-database-password
REDIS_URL=redis://your-redis-server:6379/1
```

### SSL و امنیت
- استفاده از HTTPS
- تنظیم HSTS headers
- CSRF protection
- XSS protection

### بهینه‌سازی
- استفاده از CDN برای فایل‌های استاتیک
- Gzip compression
- Database connection pooling
- Redis caching

## مشارکت

1. Fork کردن پروژه
2. ایجاد branch جدید (`git checkout -b feature/amazing-feature`)
3. Commit کردن تغییرات (`git commit -m 'Add amazing feature'`)
4. Push کردن به branch (`git push origin feature/amazing-feature`)
5. ایجاد Pull Request

## لایسنس

این پروژه تحت لایسنس MIT منتشر شده است. فایل [LICENSE](LICENSE) را برای جزئیات بیشتر مطالعه کنید.

## پشتیبانی

برای گزارش باگ یا درخواست ویژگی جدید، لطفاً از [Issues](https://github.com/your-username/pokopini-shop/issues) استفاده کنید.

## تشکر

- [Django REST Framework](https://www.django-rest-framework.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vazir Font](https://github.com/rastikerdar/vazir-font)

---

ساخته شده با ❤️ برای خانواده‌های ایرانی