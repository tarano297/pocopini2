import React from 'react';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue via-white to-pastel-pink py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary blur-2xl opacity-20 animate-pulse"></div>
              <svg 
                className="w-24 h-24 mx-auto text-primary relative z-10" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            قوانین و مقررات
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            فروشگاه اینترنتی پوکوپینی
          </p>
        </div>

        {/* Welcome Message */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <p className="text-gray-700 leading-relaxed text-justify">
            کاربر گرامی، به وب‌سایت پوکوپینی خوش آمدید. استفاده از خدمات، ثبت‌نام یا ثبت سفارش در وب‌سایت به‌معنای مطالعه، آگاهی و پذیرش کامل این قوانین و مقررات است. لطفاً پیش از استفاده از سایت، این موارد را با دقت مطالعه نمایید.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-6">

          {/* Section 1 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-coral to-primary p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center ml-3">۱</span>
                قوانین عمومی
              </h2>
            </div>
            <div className="p-8">
              <p className="text-gray-700 leading-relaxed text-justify">
                فعالیت‌های پوکوپینی مطابق با قوانین جمهوری اسلامی ایران، قانون تجارت الکترونیک و قانون حمایت از حقوق مصرف‌کننده انجام می‌شود. ادامه استفاده کاربران از وب‌سایت به منزله پذیرش هرگونه تغییر احتمالی در قوانین است. آخرین نسخه قوانین همواره از طریق همین صفحه قابل مشاهده است.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-primary to-pastel-green p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center ml-3">۲</span>
                تعریف کاربر
              </h2>
            </div>
            <div className="p-8">
              <p className="text-gray-700 leading-relaxed text-justify">
                «کاربر» به هر فرد حقیقی یا حقوقی گفته می‌شود که با ایجاد حساب کاربری یا ثبت اطلاعات خود در وب‌سایت پوکوپینی، از خدمات، محصولات یا امکانات سایت استفاده می‌کند.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-pastel-green to-coral p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center ml-3">۳</span>
                ارتباطات الکترونیکی
              </h2>
            </div>
            <div className="p-8">
              <p className="text-gray-700 leading-relaxed text-justify">
                برقراری ارتباط با پوکوپینی از طریق ایمیل، پیامک و حساب کاربری انجام می‌شود. اطلاعات ثبت‌شده توسط کاربر، از جمله شماره تماس و ایمیل، تنها راه‌های رسمی ارتباط با او خواهند بود. پوکوپینی ممکن است برای اطلاع‌رسانی خدمات، جشنواره‌ها و وضعیت سفارش‌ها، پیامک یا ایمیل ارسال نماید. امکان لغو عضویت در خبرنامه برای کاربران فراهم است.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-coral to-primary p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center ml-3">۴</span>
                حریم خصوصی و امنیت اطلاعات
              </h2>
            </div>
            <div className="p-8">
              <p className="text-gray-700 leading-relaxed text-justify">
                پوکوپینی به حریم خصوصی کاربران احترام می‌گذارد و از اطلاعات شخصی آنان محافظت می‌کند. اطلاعات کاربران تنها برای پردازش سفارش‌ها و ارائه خدمات استفاده می‌شود و بدون حکم قانونی یا رضایت کاربر، در اختیار اشخاص ثالث قرار نخواهد گرفت. کاربر مسئول حفظ محرمانگی حساب کاربری و رمز عبور خود است.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-primary to-pastel-green p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center ml-3">۵</span>
                مالکیت معنوی
              </h2>
            </div>
            <div className="p-8">
              <p className="text-gray-700 leading-relaxed text-justify">
                کلیه محتوای موجود در وب‌سایت پوکوپینی شامل متن، تصاویر، طرح‌ها، ویدئوها، آرم‌ها و هر نوع محتوای تولیدشده، متعلق به پوکوپینی است. هرگونه استفاده، کپی‌برداری، استخراج اطلاعات یا بهره‌برداری تجاری از محتوای سایت بدون اجازه کتبی پیگرد قانونی دارد.
              </p>
            </div>
          </div>

          {/* Section 6 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-pastel-green to-coral p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center ml-3">۶</span>
                ثبت، پردازش و ارسال سفارش
              </h2>
            </div>
            <div className="p-8">
              <ul className="text-gray-700 leading-relaxed text-justify space-y-3">
                <li className="flex items-start">
                  <span className="text-coral ml-2 mt-1">•</span>
                  <span>کاربران می‌توانند به‌صورت ۲۴ ساعته سفارش خود را ثبت کنند.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-coral ml-2 mt-1">•</span>
                  <span>پردازش سفارش‌ها در روزهای کاری انجام می‌شود.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-coral ml-2 mt-1">•</span>
                  <span>در صورت اتمام موجودی یا بروز مشکل در ثبت سفارش، پوکوپینی حق لغو سفارش و استرداد وجه را دارد.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-coral ml-2 mt-1">•</span>
                  <span>کاربران موظفند اطلاعات خود را به‌صورت کامل و صحیح وارد کنند؛ مسئولیت نادرستی اطلاعات بر عهده کاربر است.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-coral ml-2 mt-1">•</span>
                  <span>افزودن کالا به سبد خرید به‌معنی رزرو نیست و سفارش زمانی نهایی می‌شود که کاربر «کد سفارش» دریافت کند.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 7 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-coral to-primary p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center ml-3">۷</span>
                حمل‌ونقل و تحویل سفارش
              </h2>
            </div>
            <div className="p-8">
              <ul className="text-gray-700 leading-relaxed text-justify space-y-3">
                <li className="flex items-start">
                  <span className="text-primary ml-2 mt-1">•</span>
                  <span>کلیه بسته‌ها با بسته‌بندی استاندارد تحویل شرکت‌های حمل‌ونقل معتبر می‌شود.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary ml-2 mt-1">•</span>
                  <span>مسئولیت آسیب‌دیدگی احتمالی در زمان حمل‌ونقل به‌عهده شرکت حمل‌کننده است؛ در صورت وجود خسارت لازم است ظرف ۲۴ ساعت به پشتیبانی پوکوپینی اطلاع داده شود.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary ml-2 mt-1">•</span>
                  <span>تحویل سفارش تنها به شخص دریافت‌کننده با ارائه کارت شناسایی انجام می‌شود.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 8 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-primary to-pastel-green p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center ml-3">۸</span>
                بازگشت کالا و شرایط مرجوعی
              </h2>
            </div>
            <div className="p-8">
              <ul className="text-gray-700 leading-relaxed text-justify space-y-3">
                <li className="flex items-start">
                  <span className="text-pastel-green ml-2 mt-1">•</span>
                  <span>امکان مرجوعی تنها در صورت مغایرت کالا، نقص در محصول یا ارسال اشتباه وجود دارد.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pastel-green ml-2 mt-1">•</span>
                  <span>کالا باید در شرایط اولیه، بدون استفاده، با پلمپ و بسته‌بندی اصلی بازگردانده شود.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pastel-green ml-2 mt-1">•</span>
                  <span>در صورت اتمام موجودی، مبلغ کالا به کاربر عودت داده می‌شود.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pastel-green ml-2 mt-1">•</span>
                  <span>محصولات آرایشی و بهداشتی پس از باز شدن پلمپ یا استفاده، به‌هیچ‌وجه قابل مرجوع نیستند.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 9 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-pastel-green to-coral p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center ml-3">۹</span>
                نقد و نظرات کاربران
              </h2>
            </div>
            <div className="p-8">
              <ul className="text-gray-700 leading-relaxed text-justify space-y-3">
                <li className="flex items-start">
                  <span className="text-coral ml-2 mt-1">•</span>
                  <span>انتشار نظر کاربران به‌معنای تأیید محتوای آن توسط پوکوپینی نیست.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-coral ml-2 mt-1">•</span>
                  <span>کاربران باید از ادبیات محترمانه استفاده کرده و فقط درباره تجربه واقعی خود بنویسند.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-coral ml-2 mt-1">•</span>
                  <span>درج اطلاعات تماس، لینک وب‌سایت‌ها، اطلاعات غیرمعتبر، ادعاهای غیرقابل تأیید یا توهین، باعث عدم تأیید نظر خواهد شد.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-coral ml-2 mt-1">•</span>
                  <span>نظرات باید به‌صورت فارسی و نگارشی نوشته شوند.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 10 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-coral to-primary p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center ml-3">۱۰</span>
                محتوا و اطلاعات محصولات
              </h2>
            </div>
            <div className="p-8">
              <p className="text-gray-700 leading-relaxed text-justify">
                پوکوپینی تلاش می‌کند اطلاعات محصولات را به‌صورت صحیح و به‌روز ارائه کند، اما امکان وجود خطای سهوی وجود دارد. در صورت مشاهده مغایرت، تنها راه‌حل، مرجوع‌کردن کالا قبل از استفاده است. پوکوپینی مسئولیتی بابت اطلاعات درج‌شده روی بسته‌بندی محصولات (که توسط تولیدکنندگان ارائه می‌شود) ندارد.
              </p>
            </div>
          </div>

          {/* Section 11 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-primary to-pastel-green p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center ml-3">۱۱</span>
                قیمت‌گذاری و موجودی
              </h2>
            </div>
            <div className="p-8">
              <p className="text-gray-700 leading-relaxed text-justify">
                قیمت تمامی محصولات بر اساس شرایط بازار و موجودی تعیین می‌شود. قیمت‌های درج‌شده شامل مالیات است و هزینه ارسال هنگام ثبت سفارش به اطلاع کاربر می‌رسد. در صورت خطای سیستمی در قیمت‌گذاری، پوکوپینی حق لغو سفارش و استرداد وجه را دارد.
              </p>
            </div>
          </div>

          {/* Section 12 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-pastel-green to-coral p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center ml-3">۱۲</span>
                شرایط استفاده از کد تخفیف و امتیاز
              </h2>
            </div>
            <div className="p-8">
              <ul className="text-gray-700 leading-relaxed text-justify space-y-3">
                <li className="flex items-start">
                  <span className="text-coral ml-2 mt-1">•</span>
                  <span>استفاده هم‌زمان از «کد تخفیف» و «امتیاز» ممکن نیست.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-coral ml-2 mt-1">•</span>
                  <span>امتیازهای دریافتی تاریخ انقضا دارند و پس از موعد مقرر غیرفعال خواهند شد.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-coral ml-2 mt-1">•</span>
                  <span>پوکوپینی اختیار تغییر قوانین تخفیف‌ها و امتیازها را دارد.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 13 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-coral to-primary p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center ml-3">۱۳</span>
                قوه قهریه
              </h2>
            </div>
            <div className="p-8">
              <p className="text-gray-700 leading-relaxed text-justify">
                در صورت بروز شرایط خارج از کنترل (از جمله قطعی اینترنت، وقایع طبیعی، حوادث غیرمترقبه و …)، پوکوپینی مسئولیتی در قبال تأخیر یا عدم ارائه خدمات نخواهد داشت.
              </p>
            </div>
          </div>

          {/* Section 14 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-primary to-pastel-green p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center ml-3">۱۴</span>
                حل اختلاف
              </h2>
            </div>
            <div className="p-8">
              <p className="text-gray-700 leading-relaxed text-justify">
                هرگونه اختلاف ناشی از استفاده از وب‌سایت یا خرید از پوکوپینی، بر اساس قوانین جاری ایران و از طریق مراجع قانونی شهر تهران قابل پیگیری است. تلاش پوکوپینی همواره بر حل دوستانه اختلافات خواهد بود.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-r from-coral/10 to-primary/10 rounded-2xl p-8 text-center border border-coral/20">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            سوال یا ابهامی دارید؟
          </h3>
          <p className="text-gray-600 mb-6">
            تیم پشتیبانی ما آماده پاسخگویی به سوالات شماست
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/contact" 
              className="inline-flex items-center px-8 py-3 bg-white text-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:text-coral font-medium"
            >
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              تماس با ما
            </a>
            <a 
              href="/faq" 
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-coral to-primary text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium"
            >
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              سوالات متداول
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/" className="text-sm text-gray-600 hover:text-coral transition-colors">
              صفحه اصلی
            </a>
            <span className="text-gray-300">|</span>
            <a href="/products" className="text-sm text-gray-600 hover:text-coral transition-colors">
              محصولات
            </a>
            <span className="text-gray-300">|</span>
            <a href="/faq" className="text-sm text-gray-600 hover:text-coral transition-colors">
              سوالات متداول
            </a>
            <span className="text-gray-300">|</span>
            <a href="/profile" className="text-sm text-gray-600 hover:text-coral transition-colors">
              حساب کاربری
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
