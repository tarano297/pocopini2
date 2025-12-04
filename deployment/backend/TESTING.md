# راهنمای تست‌های پوکوپینی

## نمای کلی

این پروژه شامل تست‌های یکپارچگی برای تست جریان‌های اصلی کاربر است:
- ثبت‌نام و ورود کاربر
- مشاهده و فیلتر محصولات
- افزودن به سبد خرید و ثبت سفارش
- ثبت نظر برای محصولات

## اجرای تست‌ها

### روش 1: استفاده از manage.py

```bash
cd backend
python manage.py test
```

### روش 2: استفاده از اسکریپت تست

```bash
cd backend
python run_tests.py
```

### اجرای تست‌های خاص

```bash
# تست احراز هویت
python manage.py test accounts.tests

# تست محصولات
python manage.py test products.tests

# تست سفارشات
python manage.py test orders.tests

# تست نظرات
python manage.py test reviews.tests
```

## ساختار تست‌ها

### 1. تست‌های احراز هویت (accounts/tests.py)
- `test_user_registration`: تست ثبت‌نام کاربر جدید
- `test_user_login`: تست ورود کاربر با JWT

### 2. تست‌های محصولات (products/tests.py)
- `test_list_products`: تست لیست محصولات
- `test_filter_products_by_category`: تست فیلتر بر اساس دسته
- `test_search_products`: تست جستجوی محصولات

### 3. تست‌های سفارش (orders/tests.py)
- `test_add_to_cart`: تست افزودن محصول به سبد
- `test_complete_purchase_flow`: تست جریان کامل خرید

### 4. تست‌های نظرات (reviews/tests.py)
- `test_create_review_after_purchase`: تست ثبت نظر پس از خرید
- `test_list_product_reviews`: تست لیست نظرات محصول

## نکات مهم

1. **پایگاه داده تست**: Django به طور خودکار یک پایگاه داده موقت برای تست‌ها ایجاد می‌کند
2. **داده‌های تست**: هر تست داده‌های خود را در متد `setUp` ایجاد می‌کند
3. **ایزوله بودن**: تست‌ها مستقل از یکدیگر هستند و تداخلی ندارند

## بهینه‌سازی‌های اعمال شده

### بک‌اند
- ✅ استفاده از `select_related` و `prefetch_related` در views
- ✅ اضافه کردن database indexes به models
- ✅ پیاده‌سازی caching برای محصولات پرطرفدار
- ✅ بهینه‌سازی queries در OrderViewSet و ReviewViewSet

### فرانت‌اند
- ✅ Lazy loading برای تصاویر (LazyImage component)
- ✅ Code splitting برای صفحات (React.lazy)
- ✅ React.memo برای کامپوننت‌های سنگین (ProductCard, Footer)
- ✅ Debouncing برای جستجو (useDebounce hook)

## گزارش پوشش تست

برای مشاهده پوشش تست‌ها:

```bash
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html  # برای گزارش HTML
```

## نتیجه‌گیری

تست‌های یکپارچگی اطمینان می‌دهند که:
- جریان‌های اصلی کاربر به درستی کار می‌کنند
- APIها پاسخ‌های صحیح برمی‌گردانند
- داده‌ها به درستی در پایگاه داده ذخیره می‌شوند
- بهینه‌سازی‌ها عملکرد سیستم را بهبود می‌دهند
