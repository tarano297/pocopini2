import React from 'react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          سیاست حریم خصوصی
        </h1>
        
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              ۱. جمع‌آوری اطلاعات
            </h2>
            <p>
              ما اطلاعات شخصی شما را هنگام ثبت‌نام، خرید محصولات یا استفاده از خدمات ما جمع‌آوری می‌کنیم. 
              این اطلاعات شامل نام، آدرس ایمیل، شماره تلفن و آدرس پستی می‌باشد.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              ۲. استفاده از اطلاعات
            </h2>
            <p>
              اطلاعات جمع‌آوری شده برای پردازش سفارشات، بهبود خدمات، ارسال اطلاعیه‌های مهم و 
              ارتباط با شما در مورد محصولات و خدمات استفاده می‌شود. ما هرگز اطلاعات شما را 
              بدون اجازه به اشخاص ثالث نمی‌فروشیم.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              ۳. امنیت اطلاعات
            </h2>
            <p>
              ما از روش‌های امنیتی پیشرفته برای محافظت از اطلاعات شخصی شما استفاده می‌کنیم. 
              تمامی داده‌ها به صورت رمزنگاری شده ذخیره می‌شوند و دسترسی به آن‌ها محدود است.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              ۴. کوکی‌ها
            </h2>
            <p>
              وب‌سایت ما از کوکی‌ها برای بهبود تجربه کاربری استفاده می‌کند. شما می‌توانید 
              استفاده از کوکی‌ها را در تنظیمات مرورگر خود کنترل کنید.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              ۵. حقوق کاربران
            </h2>
            <p>
              شما حق دارید به اطلاعات شخصی خود دسترسی داشته باشید، آن‌ها را ویرایش یا حذف کنید. 
              برای هرگونه درخواست می‌توانید با پشتیبانی ما تماس بگیرید.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              ۶. تغییرات در سیاست حریم خصوصی
            </h2>
            <p>
              ما ممکن است این سیاست حریم خصوصی را به‌روزرسانی کنیم. هرگونه تغییر در این صفحه 
              منتشر خواهد شد و تاریخ آخرین به‌روزرسانی در پایین صفحه قید می‌شود.
            </p>
          </section>

          <section className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              آخرین به‌روزرسانی: {new Date().toLocaleDateString('fa-IR')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
