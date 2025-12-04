import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative text-white py-24 overflow-hidden">
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/Untitled design.mp4" type="video/mp4" />
        </video>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight drop-shadow-lg">
              درباره پوکوپینی
            </h1>
            <p className="text-2xl md:text-3xl leading-relaxed mb-4 font-semibold drop-shadow-lg">
              همراه قابل اعتماد شما در دنیای خرید آنلاین
            </p>
            <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto drop-shadow-lg">
              جایی که کیفیت، سرعت و رضایت شما در اولویت قرار دارد
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 leading-tight">
                داستان ما
              </h2>
              <p className="text-lg text-gray-700 leading-loose text-justify">
                پوکوپینی با ایده‌ای ساده آغاز شد: ایجاد فضایی که خرید آنلاین در آن نه تنها آسان، بلکه لذت‌بخش باشد. ما می‌خواستیم فروشگاهی بسازیم که مشتریان بتوانند با اطمینان کامل، محصولات مورد نیاز خود را انتخاب کنند.
              </p>
              <p className="text-lg text-gray-700 leading-loose text-justify">
                امروز، پوکوپینی به یکی از پیشروان فروش آنلاین در ایران تبدیل شده است. ما با همکاری تامین‌کنندگان معتبر، طیف گسترده‌ای از محصولات باکیفیت را با قیمت‌های رقابتی ارائه می‌دهیم.
              </p>
              <p className="text-lg text-gray-700 leading-loose text-justify">
                تیم ما متشکل از افرادی است که به کارشان عشق می‌ورزند و هر روز برای بهبود تجربه شما تلاش می‌کنند. رضایت شما، انگیزه ماست.
              </p>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 flex items-center justify-center shadow-2xl">
                <img 
                  src="/images/pocopini (2).png" 
                  alt="پوکوپینی" 
                  className="w-full h-auto object-contain rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                ارزش‌های ما
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                اصولی که بر اساس آن‌ها کار می‌کنیم و به شما خدمت می‌دهیم
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                  کیفیت برتر
                </h3>
                <p className="text-gray-600 leading-loose text-center">
                  تمام محصولات ما از برندهای معتبر تهیه می‌شوند و قبل از ارسال، کنترل کیفیت دقیقی انجام می‌گیرد. ضمانت اصالت کالا، وعده ماست.
                </p>
              </div>

              <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                  ارسال سریع
                </h3>
                <p className="text-gray-600 leading-loose text-center">
                  با شبکه لجستیک پیشرفته، سفارش شما در کوتاه‌ترین زمان ممکن با بسته‌بندی مطمئن به دست شما می‌رسد.
                </p>
              </div>

              <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                  پشتیبانی ۲۴/۷
                </h3>
                <p className="text-gray-600 leading-loose text-center">
                  تیم پشتیبانی حرفه‌ای ما در تمام ساعات شبانه‌روز آماده پاسخگویی به سوالات و رفع مشکلات شماست. تماس، چت آنلاین یا ایمیل - هر طور راحت‌تر هستید.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 mb-20">
            <div className="grid md:grid-cols-4 gap-8 text-center text-white">
              <div>
                <div className="text-5xl font-bold mb-2">۱۰۰۰+</div>
                <div className="text-lg opacity-90">محصول متنوع</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">۵۰۰۰+</div>
                <div className="text-lg opacity-90">مشتری راضی</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">۹۸٪</div>
                <div className="text-lg opacity-90">رضایت مشتریان</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">۲۴/۷</div>
                <div className="text-lg opacity-90">پشتیبانی آنلاین</div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          {/* Why Choose Us */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                چرا پوکوپینی؟
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                مزایای خرید از پوکوپینی که ما را از دیگران متمایز می‌کند
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="flex gap-5 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">ضمانت بازگشت وجه</h3>
                  <p className="text-gray-600 leading-relaxed">اگر از خرید خود راضی نبودید، تا ۷ روز فرصت بازگشت کالا و دریافت وجه دارید.</p>
                </div>
              </div>
              
              <div className="flex gap-5 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">پرداخت امن</h3>
                  <p className="text-gray-600 leading-relaxed">تمام تراکنش‌های مالی با بالاترین استانداردهای امنیتی محافظت می‌شوند.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">قیمت‌های رقابتی</h3>
                  <p className="text-gray-600">با حذف واسطه‌ها، بهترین قیمت‌ها را به شما ارائه می‌دهیم.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">تنوع محصولات</h3>
                  <p className="text-gray-600">هزاران محصول در دسته‌بندی‌های مختلف برای انتخاب شما.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="bg-gray-50 rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">ماموریت ما</h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto mb-6">
              ماموریت پوکوپینی، تبدیل شدن به پلتفرم اول انتخاب ایرانیان برای خرید آنلاین است. ما می‌خواهیم با ارائه محصولات اصل، قیمت‌های منصفانه، ارسال سریع و پشتیبانی قوی، اعتماد شما را جلب کنیم.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              هدف ما این است که هر بار که به خرید آنلاین فکر می‌کنید، اولین نامی که به ذهنتان می‌رسد، پوکوپینی باشد. چون ما نه فقط محصول می‌فروشیم، بلکه تجربه‌ای به یاد ماندنی خلق می‌کنیم.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">آماده شروع خرید هستید؟</h2>
          <p className="text-xl text-white opacity-90 mb-8">
            هزاران محصول با کیفیت در انتظار شماست
          </p>
          <Link to="/products" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-colors">
            مشاهده محصولات
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
