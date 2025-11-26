# لیست وظایف پیاده‌سازی - فروشگاه آنلاین پوکوپینی

- [x] 1. راه‌اندازی پروژه Django و ساختار اولیه بک‌اند



  - ایجاد پروژه Django با نام pokopini
  - نصب و پیکربندی Django REST Framework
  - نصب کتابخانه‌های مورد نیاز: djangorestframework, djangorestframework-simplejwt, django-cors-headers, Pillow, jdatetime
  - ایجاد اپلیکیشن‌های accounts, products, orders, reviews
  - پیکربندی CORS و JWT در settings.py
  - تنظیم MEDIA_ROOT و MEDIA_URL برای آپلود تصاویر
  - پیکربندی زبان فارسی و timezone تهران





  - _الزامات: 1.1, 1.2, 10.1, 10.4, 9.1_

- [x] 2. پیاده‌سازی مدل User و سیستم احراز هویت


  - [x] 2.1 ایجاد مدل User سفارشی با فیلد phone_number





    - توسعه AbstractUser برای اضافه کردن فیلدهای اضافی
    - تنظیم AUTH_USER_MODEL در settings
    - _الزامات: 1.1_


  
  - [x] 2.2 پیاده‌سازی serializers برای ثبت‌نام و ورود





    - ایجاد RegisterSerializer با اعتبارسنجی ایمیل و یوزرنیم یکتا



    - ایجاد LoginSerializer
    - ایجاد UserProfileSerializer
    - _الزامات: 1.1, 1.5_
  
  - [x] 2.3 ایجاد APIهای احراز هویت

    - پیاده‌سازی RegisterView برای ثبت‌نام
    - پیاده‌سازی LoginView با JWT token
    - پیاده‌سازی ProfileView برای نمایش و ویرایش پروفایل
    - تنظیم URLهای مربوطه
    - _الزامات: 1.1, 1.2, 1.3_






- [x] 3. پیاده‌سازی مدل Address و APIهای مدیریت آدرس






  - [x] 3.1 ایجاد مدل Address

    - تعریف فیلدهای کامل آدرس (استان، شهر، کدپستی، آدرس کامل)


    - اضافه کردن فیلد is_default
    - رابطه ForeignKey با User
    - _الزامات: 2.1_
  



  - [x] 3.2 پیاده‌سازی AddressSerializer و ViewSet

    - ایجاد AddressSerializer
    - پیاده‌سازی AddressViewSet با CRUD کامل
    - اضافه کردن action سفارشی set_default
    - محدود کردن دسترسی به آدرس‌های خود کاربر


    - _الزامات: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 4. پیاده‌سازی مدل Product و APIهای محصولات




  - [x] 4.1 ایجاد مدل Product





    - تعریف فیلدهای نام، توضیح، قیمت، دسته، فصل، عکس، رنگ، سایز
    - تعریف CATEGORY_CHOICES و SEASON_CHOICES
    - اضافه کردن فیلدهای stock و is_active


    - _الزامات: 3.1, 3.2, 3.3, 3.5_
  
  - [x] 4.2 پیاده‌سازی ProductSerializer و فیلترها




    - ایجاد ProductSerializer با تمام فیلدها
    - پیاده‌سازی فیلترهای category, season, color, size
    - اضافه کردن قابلیت جستجو در نام و توضیحات
    - _الزامات: 4.1, 4.2, 4.3, 4.4, 4.5_
  

  - [x] 4.3 ایجاد ProductViewSet و APIها





    - پیاده‌سازی ProductViewSet با list و retrieve
    - اضافه کردن action سفارشی featured برای محصولات ویژه
    - تنظیم pagination
    - تنظیم URLهای مربوطه
    - _الزامات: 4.1, 4.6_


  
  - [x] 4.4 پیکربندی پنل ادمین برای محصولات





    - ثبت مدل Product در admin.py
    - سفارشی‌سازی نمایش لیست و فیلترها
    - اضافه کردن قابلیت جستجو


    - فارسی‌سازی رابط ادمین
    - _الزامات: 3.4, 7.1, 7.5_

- [x] 5. پیاده‌سازی سیستم سبد خرید


  - [x] 5.1 ایجاد مدل Cart و CartItem





    - تعریف مدل Cart با رابطه به User
    - تعریف مدل CartItem با رابطه به Cart و Product
    - اضافه کردن فیلد quantity


    - _الزامات: 5.1_


  
  - [x] 5.2 پیاده‌سازی CartSerializer و APIها





    - ایجاد CartSerializer و CartItemSerializer
    - پیاده‌سازی CartViewSet با actionهای add, update, remove, clear
    - محاسبه قیمت کل سبد
    - _الزامات: 5.1, 5.2, 5.3_

- [x] 6. پیاده‌سازی مدل Order و سیستم سفارش



  - [x] 6.1 ایجاد مدل‌های Order و OrderItem

    - تعریف مدل Order با فیلدهای user, address, status, total_price
    - تعریف STATUS_CHOICES
    - تعریف مدل OrderItem با رابطه به Order و Product
    - _الزامات: 6.1, 6.6_
  

  - [x] 6.2 پیاده‌سازی OrderSerializer و APIها





    - ایجاد OrderSerializer و OrderItemSerializer
    - پیاده‌سازی OrderViewSet با list, retrieve, create
    - منطق ثبت سفارش از سبد خرید

    - ذخیره تاریخ به صورت شمسی
    - _الزامات: 5.4, 5.5, 6.1_
  
  - [x] 6.3 پیکربندی پنل ادمین برای سفارشات





    - ثبت مدل‌های Order و OrderItem در admin.py
    - نمایش inline برای OrderItem
    - فیلتر بر اساس وضعیت و تاریخ
    - _الزامات: 7.3_

- [x] 7. پیاده‌سازی سیستم نظرات





  - [x] 7.1 ایجاد مدل Review
    - تعریف مدل Review با فیلدهای product, user, rating, comment
    - اضافه کردن unique_together برای جلوگیری از نظر تکراری
    - _الزامات: 6.3_

  
  - [x] 7.2 پیاده‌سازی ReviewSerializer و permission سفارشی

    - ایجاد ReviewSerializer
    - پیاده‌سازی HasPurchasedProduct permission
    - بررسی خرید محصول قبل از ثبت نظر
    - _الزامات: 6.1, 6.2_
  


  - [x] 7.3 ایجاد ReviewViewSet و APIها
    - پیاده‌سازی ReviewViewSet با CRUD
    - محدود کردن ویرایش و حذف به صاحب نظر
    - API برای نمایش نظرات هر محصول
    - _الزامات: 6.1, 6.4, 6.5_

  

  - [x] 7.4 پیکربندی پنل ادمین برای نظرات

    - ثبت مدل Review در admin.py
    - فیلتر بر اساس محصول و کاربر
    - _الزامات: 7.4_

- [x] 8. راه‌اندازی پروژه React و ساختار اولیه فرانت‌اند


  - ایجاد پروژه React با Create React App یا Vite
  - نصب کتابخانه‌های مورد نیاز: react-router-dom, axios, moment-jalaali, tailwindcss
  - پیکربندی Tailwind CSS با RTL
  - اضافه کردن فونت فارسی (Vazir)
  - ایجاد ساختار فولدرها: components, pages, contexts, services, utils
  - قرار دادن لوگوی پوکوپینی در public
  - _الزامات: 8.6, 8.7, 9.3, 9.4_





- [x] 9. پیاده‌سازی سرویس‌های API و utility functions





  - [x] 9.1 ایجاد API service پایه

    - تنظیم Axios instance با baseURL


    - پیاده‌سازی interceptors برای اضافه کردن JWT token
    - مدیریت خطاها و refresh token
    - _الزامات: 10.1, 10.2_
  

  - [x] 9.2 پیاده‌سازی سرویس‌های تخصصی





    - authService: register, login, logout, getProfile
    - productService: getProducts, getProductById, getFeaturedProducts


    - orderService: createOrder, getOrders, getOrderById
    - reviewService: getProductReviews, createReview, updateReview, deleteReview
    - addressService: getAddresses, createAddress, updateAddress, deleteAddress




    - cartService: getCart, addToCart, updateCart, removeFromCart
    - _الزامات: 1.1, 1.2, 4.1, 5.1, 6.1_
  
  - [x] 9.3 ایجاد utility functions



    - dateUtils: تبدیل تاریخ میلادی به شمسی با moment-jalaali
    - priceUtils: فرمت قیمت به تومان با جداکننده هزارگان






    - numberUtils: تبدیل اعداد انگلیسی به فارسی
    - _الزامات: 9.1, 9.2, 9.5_

- [x] 10. پیاده‌سازی Context API برای مدیریت state




  - [x] 10.1 ایجاد AuthContext



    - مدیریت state کاربر و token
    - توابع login, logout, register
    - ذخیره token در localStorage


    - _الزامات: 1.1, 1.2_
  
  - [x] 10.2 ایجاد CartContext





    - مدیریت state سبد خرید
    - توابع addToCart, removeFromCart, updateQuantity, clearCart


    - محاسبه totalPrice و itemCount
    - _الزامات: 5.1, 5.2, 5.3_






- [x] 11. پیاده‌سازی کامپوننت‌های مشترک






  - [x] 11.1 ایجاد Navbar

    - نمایش لوگوی پوکوپینی
    - منوی دسته‌بندی‌ها


    - جستجو
    - آیکون سبد خرید با تعداد
    - دکمه ورود/خروج
    - _الزامات: 8.1_



  

  - [x] 11.2 ایجاد Footer

    - اطلاعات تماس
    - لینک‌های مفید
    - شبکه‌های اجتماعی





    - _الزامات: 8.1_

  

  - [x] 11.3 ایجاد ProductCard

    - نمایش تصویر محصول
    - نام و قیمت



    - دکمه افزودن به سبد
    - نمایش دسته و فصل
    - _الزامات: 4.1, 8.1_
  








  - [x] 11.4 ایجاد کامپوننت‌های کمکی

    - LoadingSpinner: نمایش لودینگ
    - ErrorMessage: نمایش خطاها
    - ProtectedRoute: محافظت از روت‌های خصوصی
    - FilterSidebar: فیلترهای جانبی



    - _الزامات: 8.1_







- [x] 12. پیاده‌سازی صفحات احراز هویت






  - [x] 12.1 ایجاد صفحه Login

    - فرم ورود با یوزرنیم و پسورد
    - اعتبارسنجی سمت کلاینت
    - اتصال به AuthContext
    - نمایش خطاها
    - _الزامات: 1.1, 1.2, 8.3_
  

  - [x] 12.2 ایجاد صفحه Register


    - فرم ثبت‌نام با فیلدهای کامل
    - اعتبارسنجی سمت کلاینت
    - اتصال به AuthContext





    - نمایش خطاها
    - _الزامات: 1.1, 8.3_

- [x] 13. پیاده‌سازی صفحه اصلی (Home)


  - نمایش لوگوی پوکوپینی در هدر
  - بخش دسته‌بندی‌ها (نوزاد، دخترانه، پسرانه)




  - نمایش محصولات جدید و ویژه
  - استفاده از ProductCard
  - طراحی واکنش‌گرا
  - _الزامات: 8.1, 8.8_



- [x] 14. پیاده‌سازی صفحات محصولات




  - [x] 14.1 ایجاد صفحه Product Listing


    - نمایش لیست محصولات به صورت Grid
    - FilterSidebar برای فیلتر بر اساس دسته، فصل، رنگ، سایز
    - جستجو در محصولات
    - Pagination
    - _الزامات: 4.1, 4.2, 4.3, 4.4, 4.5, 8.1_
  
  - [x] 14.2 ایجاد صفحه Product Detail



    - نمایش تصویر بزرگ محصول
    - نام، توضیحات، قیمت، دسته، فصل، رنگ، سایز
    - انتخاب تعداد
    - دکمه افزودن به سبد
    - بخش نمایش نظرات
    - فرم ثبت نظر (اگر کاربر خریده باشد)
    - _الزامات: 4.6, 6.1, 6.4, 8.2_

- [x] 15. پیاده‌سازی صفحه سبد خرید و ثبت سفارش





  - [x] 15.1 ایجاد صفحه Cart


    - نمایش لیست محصولات سبد
    - امکان تغییر تعداد
    - امکان حذف محصول
    - محاسبه و نمایش قیمت کل
    - دکمه ادامه خرید
    - _الزامات: 5.2, 8.5_
  
  - [x] 15.2 ایجاد صفحه Checkout


    - انتخاب آدرس تحویل
    - خلاصه سفارش
    - دکمه تایید نهایی
    - اتصال به orderService
    - _الزامات: 5.4, 8.5_

- [x] 16. پیاده‌سازی صفحه پروفایل کاربر





  - [x] 16.1 بخش اطلاعات کاربر


    - نمایش اطلاعات پروفایل
    - امکان ویرایش اطلاعات
    - _الزامات: 8.4_
  
  - [x] 16.2 بخش مدیریت آدرس‌ها

    - نمایش لیست آدرس‌ها
    - فرم افزودن آدرس جدید
    - امکان ویرایش و حذف آدرس
    - تنظیم آدرس پیش‌فرض
    - _الزامات: 2.1, 2.2, 2.3, 2.4, 2.5, 8.4_
  
  - [x] 16.3 بخش تاریخچه سفارشات

    - نمایش لیست سفارشات کاربر
    - نمایش جزئیات هر سفارش
    - نمایش وضعیت سفارش
    - نمایش تاریخ به صورت شمسی
    - _الزامات: 6.1, 8.4, 9.1_

- [x] 17. پیاده‌سازی مدیریت خطا و UX









  - [x] 17.1 ErrorBoundary برای React

    - گرفتن خطاهای React
    - نمایش UI جایگزین
    - لاگ کردن خطا
    - _الزامات: 8.1_
  
  - [x] 17.2 مدیریت خطاهای API


    - نمایش پیام‌های خطا به فارسی
    - Toast notifications برای عملیات موفق
    - Retry mechanism برای خطاهای شبکه
    - _الزامات: 8.1_

- [x] 18. بهینه‌سازی و تست نهایی







  - [x] 18.1 بهینه‌سازی فرانت‌اند

    - Lazy loading برای تصاویر
    - Code splitting برای صفحات
    - React.memo برای کامپوننت‌های سنگین
    - Debouncing برای جستجو
    - _الزامات: 8.8_

  
  - [x] 18.2 بهینه‌سازی بک‌اند

    - استفاده از select_related و prefetch_related
    - Database indexing
    - Caching برای محصولات پرطرفدار
    - _الزامات: 3.1, 4.1_
  

  - [x] 18.3 تست‌های یکپارچگی


    - تست user flows اصلی (ثبت‌نام، خرید، نظر)
    - تست APIها
    - تست فرم‌ها و navigation
    - _الزامات: تمام الزامات_

- [x] 19. آماده‌سازی برای استقرار






  - تنظیم environment variables
  - پیکربندی PostgreSQL برای production
  - تنظیم DEBUG=False
  - پیکربندی ALLOWED_HOSTS
  - جمع‌آوری فایل‌های استاتیک با collectstatic
  - Build کردن فرانت‌اند
  - تنظیم Nginx برای سرو فایل‌ها
  - پیکربندی HTTPS
  - _الزامات: 10.3_
