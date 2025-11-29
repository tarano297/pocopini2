# راهنمای کد محصول

## تغییرات انجام شده

### 1. مدل Product
- فیلد `product_code` به مدل Product اضافه شد
- کد محصول به صورت خودکار با فرمت `PKP-XXXXX` تولید می‌شود
- کد محصول یکتا (unique) است

### 2. نمایش در فاکتور
کد محصول در موارد زیر نمایش داده می‌شود:
- صفحه تایید نهایی سفارش (OrderConfirmation)
- صفحه موفقیت سفارش (OrderSuccess)
- فاکتور قابل چاپ
- فاکتور قابل دانلود (HTML)

### 3. پنل مدیریت
- کد محصول در لیست محصولات نمایش داده می‌شود
- امکان جستجو بر اساس کد محصول
- کد محصول به صورت خودکار تولید می‌شود (read-only)

### 4. API
کد محصول در تمام endpoint های محصول برگردانده می‌شود:
- لیست محصولات
- جزئیات محصول
- سبد خرید
- سفارشات

## فرمت کد محصول

```
PKP-XXXXX
```

- `PKP`: مخفف PokoPini
- `XXXXX`: شماره محصول با 5 رقم (با صفر پر می‌شود)

مثال: `PKP-00001`, `PKP-00042`, `PKP-01234`

## تولید کد برای محصولات موجود

برای تولید کد برای محصولات موجود که کد ندارند:

```bash
cd backend
python generate_product_codes.py
```

یا:

```bash
cd backend
python manage.py shell -c "from products.models import Product; [p.save() for p in Product.objects.filter(product_code__isnull=True)]"
```

## Migration

Migration برای اضافه کردن فیلد product_code:

```bash
cd backend
python manage.py makemigrations products
python manage.py migrate products
```

## استفاده در Frontend

کد محصول در object محصول موجود است:

```javascript
// در سبد خرید
item.product.product_code  // "PKP-00001"

// در لیست محصولات
product.product_code  // "PKP-00001"
```

## نمایش در فاکتور

کد محصول در فاکتور به صورت زیر نمایش داده می‌شود:

```
نام محصول
کد محصول: PKP-00001
تعداد: 2
قیمت واحد: 150,000 تومان
```

## نکات مهم

1. کد محصول به صورت خودکار تولید می‌شود
2. نیازی به وارد کردن دستی کد نیست
3. کد محصول یکتا است و نمی‌تواند تکراری باشد
4. کد محصول در پنل ادمین قابل ویرایش نیست (read-only)
5. برای محصولات جدید، کد به صورت خودکار در هنگام ذخیره تولید می‌شود

## ProductVariant SKU

علاوه بر کد محصول، هر variant هم یک SKU دارد:

```
{product_id}-{color}-{size}
```

مثال: `9-red-2y` (محصول 9، رنگ قرمز، سایز 2 سال)
