# مستندات طراحی - فروشگاه آنلاین پوکوپینی

## نمای کلی

پوکوپینی یک فروشگاه آنلاین دو لایه است که از معماری Client-Server استفاده می‌کند. بک‌اند با Django REST Framework پیاده‌سازی شده و APIهای RESTful را ارائه می‌دهد. فرانت‌اند با React ساخته شده و از Context API برای مدیریت state استفاده می‌کند. ارتباط بین دو لایه از طریق HTTP/HTTPS و با استفاده از JWT برای احراز هویت انجام می‌شود.

## معماری سیستم

### معماری کلی

```
┌─────────────────────────────────────────────────────────────┐
│                      React Frontend                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │Components│  │ Contexts │  │ Services │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTP/HTTPS + JWT
                            │
┌─────────────────────────────────────────────────────────────┐
│                   Django REST Framework                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Views   │  │Serializers│ │  Models  │  │  Admin   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                      PostgreSQL/SQLite
```

### ساختار پروژه

```
pokopini/
├── backend/
│   ├── pokopini/              # پروژه اصلی Django
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── accounts/              # اپلیکیشن کاربران
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── products/              # اپلیکیشن محصولات
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── admin.py
│   │   └── urls.py
│   ├── orders/                # اپلیکیشن سفارشات
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── admin.py
│   │   └── urls.py
│   ├── reviews/               # اپلیکیشن نظرات
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── admin.py
│   │   └── urls.py
│   ├── media/                 # فایل‌های آپلود شده
│   ├── static/                # فایل‌های استاتیک
│   ├── requirements.txt
│   └── manage.py
│
└── frontend/
    ├── public/
    │   └── logo.png           # لوگوی پوکوپینی
    ├── src/
    │   ├── components/        # کامپوننت‌های قابل استفاده مجدد
    │   │   ├── Navbar.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── Footer.jsx
    │   │   └── ...
    │   ├── pages/             # صفحات اصلی
    │   │   ├── Home.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Profile.jsx
    │   │   └── ...
    │   ├── contexts/          # Context API
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── services/          # سرویس‌های API
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── productService.js
    │   │   └── ...
    │   ├── utils/             # توابع کمکی
    │   │   ├── dateUtils.js   # تبدیل تاریخ شمسی
    │   │   ├── priceUtils.js  # فرمت قیمت
    │   │   └── ...
    │   ├── App.jsx
    │   └── index.js
    ├── package.json
    └── tailwind.config.js
```

## کامپوننت‌ها و رابط‌ها

### بک‌اند (Django)

#### مدل‌های پایگاه داده

**User Model (توسعه یافته از AbstractUser)**
```python
class User(AbstractUser):
    phone_number = CharField(max_length=11, unique=True, null=True)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
```

**Address Model**
```python
class Address(Model):
    user = ForeignKey(User, on_delete=CASCADE, related_name='addresses')
    full_name = CharField(max_length=100)
    phone_number = CharField(max_length=11)
    province = CharField(max_length=50)
    city = CharField(max_length=50)
    postal_code = CharField(max_length=10)
    address_line = TextField()
    is_default = BooleanField(default=False)
    created_at = DateTimeField(auto_now_add=True)
```

**Product Model**
```python
class Product(Model):
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
    
    name = CharField(max_length=200)
    description = TextField()
    price = DecimalField(max_digits=10, decimal_places=0)  # تومان
    category = CharField(max_length=10, choices=CATEGORY_CHOICES)
    season = CharField(max_length=10, choices=SEASON_CHOICES)
    image = ImageField(upload_to='products/')
    color = CharField(max_length=50)
    size = CharField(max_length=20)
    stock = PositiveIntegerField(default=0)
    is_active = BooleanField(default=True)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
```

**Order Model**
```python
class Order(Model):
    STATUS_CHOICES = [
        ('pending', 'در انتظار'),
        ('processing', 'در حال پردازش'),
        ('shipped', 'ارسال شده'),
        ('delivered', 'تحویل داده شده'),
        ('cancelled', 'لغو شده'),
    ]
    
    user = ForeignKey(User, on_delete=CASCADE, related_name='orders')
    address = ForeignKey(Address, on_delete=SET_NULL, null=True)
    status = CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_price = DecimalField(max_digits=10, decimal_places=0)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
```

**OrderItem Model**
```python
class OrderItem(Model):
    order = ForeignKey(Order, on_delete=CASCADE, related_name='items')
    product = ForeignKey(Product, on_delete=CASCADE)
    quantity = PositiveIntegerField(default=1)
    price = DecimalField(max_digits=10, decimal_places=0)  # قیمت در زمان خرید
```

**Review Model**
```python
class Review(Model):
    product = ForeignKey(Product, on_delete=CASCADE, related_name='reviews')
    user = ForeignKey(User, on_delete=CASCADE, related_name='reviews')
    rating = PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = TextField()
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['product', 'user']
```

#### APIها و Endpoints

**Authentication APIs**
- `POST /api/auth/register/` - ثبت‌نام کاربر جدید
- `POST /api/auth/login/` - ورود کاربر و دریافت JWT token
- `POST /api/auth/refresh/` - تازه‌سازی access token
- `GET /api/auth/profile/` - دریافت اطلاعات پروفایل کاربر
- `PUT /api/auth/profile/` - ویرایش اطلاعات پروفایل

**Address APIs**
- `GET /api/addresses/` - لیست آدرس‌های کاربر
- `POST /api/addresses/` - افزودن آدرس جدید
- `GET /api/addresses/{id}/` - جزئیات یک آدرس
- `PUT /api/addresses/{id}/` - ویرایش آدرس
- `DELETE /api/addresses/{id}/` - حذف آدرس
- `POST /api/addresses/{id}/set-default/` - تنظیم به عنوان آدرس پیش‌فرض

**Product APIs**
- `GET /api/products/` - لیست محصولات با فیلتر و جستجو
  - Query params: `category`, `season`, `color`, `size`, `search`
- `GET /api/products/{id}/` - جزئیات محصول
- `GET /api/products/featured/` - محصولات ویژه برای صفحه اصلی

**Cart APIs**
- `GET /api/cart/` - نمایش سبد خرید
- `POST /api/cart/add/` - افزودن محصول به سبد
- `PUT /api/cart/update/{item_id}/` - به‌روزرسانی تعداد
- `DELETE /api/cart/remove/{item_id}/` - حذف از سبد
- `DELETE /api/cart/clear/` - خالی کردن سبد

**Order APIs**
- `GET /api/orders/` - لیست سفارشات کاربر
- `POST /api/orders/` - ثبت سفارش جدید
- `GET /api/orders/{id}/` - جزئیات سفارش

**Review APIs**
- `GET /api/products/{id}/reviews/` - نظرات یک محصول
- `POST /api/products/{id}/reviews/` - ثبت نظر (با بررسی خرید)
- `PUT /api/reviews/{id}/` - ویرایش نظر
- `DELETE /api/reviews/{id}/` - حذف نظر

#### Serializers

هر مدل یک Serializer اختصاصی دارد که شامل:
- اعتبارسنجی داده‌ها
- تبدیل داده‌ها به JSON
- مدیریت روابط بین مدل‌ها
- فیلدهای read-only و write-only

#### Permissions

- `IsAuthenticated`: برای APIهای نیازمند احراز هویت
- `IsOwner`: برای اطمینان از دسترسی کاربر به داده‌های خودش
- `HasPurchasedProduct`: برای بررسی خرید محصول قبل از ثبت نظر

### فرانت‌اند (React)

#### Context API

**AuthContext**
```javascript
{
  user: Object | null,
  token: String | null,
  login: Function,
  logout: Function,
  register: Function,
  isAuthenticated: Boolean
}
```

**CartContext**
```javascript
{
  cartItems: Array,
  addToCart: Function,
  removeFromCart: Function,
  updateQuantity: Function,
  clearCart: Function,
  totalPrice: Number,
  itemCount: Number
}
```

#### Services

**API Service (api.js)**
- تنظیم Axios instance با baseURL
- اضافه کردن JWT token به هدرها
- مدیریت خطاها
- Interceptors برای refresh token

**Auth Service**
- `register(userData)`
- `login(credentials)`
- `logout()`
- `getProfile()`
- `updateProfile(data)`

**Product Service**
- `getProducts(filters)`
- `getProductById(id)`
- `getFeaturedProducts()`

**Order Service**
- `createOrder(orderData)`
- `getOrders()`
- `getOrderById(id)`

**Review Service**
- `getProductReviews(productId)`
- `createReview(productId, reviewData)`
- `updateReview(reviewId, data)`
- `deleteReview(reviewId)`

#### صفحات اصلی

**Home Page**
- نمایش لوگوی پوکوپینی
- دسته‌بندی‌ها (نوزاد، دخترانه، پسرانه)
- محصولات جدید و ویژه
- بنرهای تبلیغاتی

**Product Listing Page**
- فیلترهای جانبی (دسته، فصل، رنگ، سایز)
- نمایش محصولات به صورت Grid
- Pagination

**Product Detail Page**
- تصویر محصول
- نام، توضیحات، قیمت
- انتخاب تعداد
- دکمه افزودن به سبد
- نمایش نظرات
- فرم ثبت نظر (اگر خریده باشد)

**Login/Register Pages**
- فرم ورود با یوزرنیم و پسورد
- فرم ثبت‌نام با فیلدهای کامل
- اعتبارسنجی سمت کلاینت

**Profile Page**
- نمایش اطلاعات کاربر
- مدیریت آدرس‌ها
- تاریخچه سفارشات

**Cart Page**
- لیست محصولات سبد
- محاسبه قیمت کل
- دکمه ثبت سفارش

**Checkout Page**
- انتخاب آدرس
- خلاصه سفارش
- تایید نهایی

#### کامپوننت‌های مشترک

- **Navbar**: منوی بالا با لوگو، جستجو، سبد خرید، ورود/خروج
- **Footer**: اطلاعات تماس، لینک‌های مفید
- **ProductCard**: کارت محصول برای نمایش در لیست
- **FilterSidebar**: فیلترهای جانبی
- **LoadingSpinner**: نمایش لودینگ
- **ErrorMessage**: نمایش خطاها
- **ProtectedRoute**: محافظت از روت‌های نیازمند احراز هویت

## مدل‌های داده

مدل‌های داده در بخش "کامپوننت‌ها و رابط‌ها" توضیح داده شده‌اند.

### روابط بین مدل‌ها

```
User ──┬─── 1:N ──→ Address
       ├─── 1:N ──→ Order
       └─── 1:N ──→ Review

Product ──┬─── 1:N ──→ OrderItem
          └─── 1:N ──→ Review

Order ──┬─── N:1 ──→ User
        ├─── N:1 ──→ Address
        └─── 1:N ──→ OrderItem

Review ──┬─── N:1 ──→ User
         └─── N:1 ──→ Product
```

## مدیریت خطا

### بک‌اند

**استراتژی مدیریت خطا:**
- استفاده از Django REST Framework exception handlers
- بازگشت کدهای HTTP مناسب
- پیام‌های خطا به زبان فارسی
- لاگ کردن خطاها برای debugging

**کدهای خطای رایج:**
- `400 Bad Request`: داده‌های نامعتبر
- `401 Unauthorized`: عدم احراز هویت
- `403 Forbidden`: عدم دسترسی
- `404 Not Found`: منبع یافت نشد
- `500 Internal Server Error`: خطای سرور

**فرمت پاسخ خطا:**
```json
{
  "error": "پیام خطا به فارسی",
  "details": {
    "field": ["لیست خطاهای فیلد"]
  }
}
```

### فرانت‌اند

**استراتژی مدیریت خطا:**
- استفاده از try-catch در async functions
- نمایش پیام‌های خطا به کاربر
- Fallback UI برای خطاهای بحرانی
- Retry mechanism برای خطاهای شبکه

**کامپوننت ErrorBoundary:**
- گرفتن خطاهای React
- نمایش UI جایگزین
- لاگ کردن خطا

## استراتژی تست

### تست‌های بک‌اند

**Unit Tests:**
- تست مدل‌ها (validation, methods)
- تست serializers
- تست permissions

**Integration Tests:**
- تست APIها با Django TestCase
- تست authentication flow
- تست business logic (مثلاً بررسی خرید قبل از ثبت نظر)

**ابزارها:**
- Django TestCase
- Django REST Framework APITestCase
- Factory Boy برای ساخت داده‌های تست

### تست‌های فرانت‌اند

**Unit Tests:**
- تست کامپوننت‌ها
- تست utility functions
- تست services

**Integration Tests:**
- تست user flows
- تست form submissions
- تست navigation

**ابزارها:**
- Jest
- React Testing Library
- Mock Service Worker برای mock کردن API

## ملاحظات امنیتی

### احراز هویت و مجوزدهی

- استفاده از JWT با access token (15 دقیقه) و refresh token (7 روز)
- هش کردن پسوردها با bcrypt
- محافظت از APIها با permissions
- CSRF protection برای فرم‌ها

### اعتبارسنجی

- اعتبارسنجی سمت سرور برای تمام ورودی‌ها
- اعتبارسنجی سمت کلاینت برای UX بهتر
- Sanitization برای جلوگیری از XSS

### CORS

- تنظیم CORS برای دامنه فرانت‌اند
- محدود کردن methods مجاز
- تنظیم headers مجاز

### HTTPS

- استفاده از HTTPS در production
- Secure cookies برای tokens
- HSTS headers

## بومی‌سازی ایرانی

### تاریخ شمسی

**بک‌اند:**
- استفاده از کتابخانه `jdatetime`
- ذخیره تاریخ به صورت UTC در database
- تبدیل به شمسی در serializers

**فرانت‌اند:**
- استفاده از کتابخانه `moment-jalaali`
- نمایش تاریخ به فرمت فارسی
- تبدیل اعداد به فارسی

### واحد پولی

- ذخیره قیمت به تومان
- فرمت نمایش: `۱۲۳,۴۵۶ تومان`
- استفاده از `Intl.NumberFormat` با locale فارسی

### RTL و فونت

**Tailwind Config:**
```javascript
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        'vazir': ['Vazir', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('tailwindcss-rtl'),
  ],
}
```

**فونت‌های پیشنهادی:**
- Vazir
- Yekan
- IRANSans

### اعداد فارسی

تابع تبدیل اعداد انگلیسی به فارسی:
```javascript
const toPersianDigits = (num) => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  return num.toString().replace(/\d/g, (d) => persianDigits[d]);
};
```

## ملاحظات عملکرد

### بک‌اند

- استفاده از `select_related` و `prefetch_related` برای کاهش queries
- Pagination برای لیست محصولات
- Caching برای محصولات پرطرفدار
- Database indexing برای فیلدهای جستجو

### فرانت‌اند

- Lazy loading برای تصاویر
- Code splitting برای صفحات
- Memoization برای کامپوننت‌های سنگین
- Debouncing برای جستجو
- استفاده از React.memo برای جلوگیری از re-render

## استقرار (Deployment)

### بک‌اند

**محیط Production:**
- استفاده از PostgreSQL به جای SQLite
- تنظیم `DEBUG = False`
- استفاده از Gunicorn یا uWSGI
- Nginx به عنوان reverse proxy
- استفاده از environment variables برای تنظیمات حساس

**فایل‌های استاتیک:**
- جمع‌آوری با `collectstatic`
- سرو از طریق Nginx یا CDN

### فرانت‌اند

**Build:**
- `npm run build` برای ساخت production build
- بهینه‌سازی bundle size
- Minification و compression

**Hosting:**
- سرو از Nginx
- یا استفاده از CDN

## نقشه راه توسعه

### فاز ۱: MVP (حداقل محصول قابل ارائه)
- احراز هویت کاربر
- نمایش و فیلتر محصولات
- سبد خرید و ثبت سفارش
- پنل ادمین پایه

### فاز ۲: ویژگی‌های اضافی
- سیستم نظرات
- مدیریت آدرس‌ها
- تاریخچه سفارشات
- جستجوی پیشرفته

### فاز ۳: بهبودها
- سیستم پرداخت آنلاین
- اعلان‌ها (ایمیل/SMS)
- سیستم تخفیف و کوپن
- Wishlist
- مقایسه محصولات

### فاز ۴: بهینه‌سازی
- بهبود عملکرد
- PWA
- پشتیبانی آفلاین
- Analytics
