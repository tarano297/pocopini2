import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "چگونه می‌توانم سفارش ثبت کنم؟",
      answer: "برای ثبت سفارش، ابتدا محصول مورد نظر خود را انتخاب کنید، سپس روی دکمه 'افزودن به سبد خرید' کلیک کنید. پس از اتمام خرید، به سبد خرید بروید و مراحل تکمیل سفارش را دنبال کنید. در نهایت، اطلاعات آدرس و روش پرداخت را وارد کرده و سفارش خود را نهایی کنید."
    },
    {
      question: "زمان ارسال سفارش چقدر است؟",
      answer: "زمان ارسال سفارش بستگی به موقعیت جغرافیایی شما دارد. معمولاً سفارشات در شهرهای بزرگ ظرف 2 تا 3 روز کاری و در شهرستان‌ها ظرف 3 تا 5 روز کاری ارسال می‌شود. پس از ارسال، کد رهگیری مرسوله برای شما پیامک خواهد شد."
    },
    {
      question: "هزینه ارسال چقدر است؟",
      answer: "هزینه ارسال بسته به وزن و حجم سفارش و همچنین مقصد ارسال متفاوت است. برای سفارشات بالای 500 هزار تومان، ارسال رایگان است. هزینه دقیق ارسال در مرحله تکمیل سفارش نمایش داده می‌شود."
    },
    {
      question: "روش‌های پرداخت چیست؟",
      answer: "شما می‌توانید از طریق درگاه پرداخت اینترنتی (کارت‌های عضو شتاب) و یا پرداخت در محل (برای شهرهای خاص) سفارش خود را پرداخت کنید. تمامی پرداخت‌های آنلاین از طریق درگاه امن بانکی انجام می‌شود."
    },
    {
      question: "آیا امکان مرجوعی کالا وجود دارد؟",
      answer: "بله، شما می‌توانید تا 7 روز پس از دریافت کالا، در صورت عدم رضایت یا وجود مشکل در محصول، درخواست مرجوعی دهید. کالا باید در شرایط اولیه و با بسته‌بندی سالم باشد. برای اطلاعات بیشتر با پشتیبانی تماس بگیرید."
    },
    {
      question: "چگونه می‌توانم سفارش خود را پیگیری کنم؟",
      answer: "برای پیگیری سفارش، می‌توانید به بخش 'پیگیری سفارشات' مراجعه کرده و فاکتور خرید خود را به صفحه اینستاگرام ما ارسال کنید. همچنین می‌توانید با کد رهگیری ارسال شده از طریق پیامک، مرسوله خود را در سایت پست پیگیری کنید."
    },
    {
      question: "آیا محصولات اصل و با کیفیت هستند؟",
      answer: "تمامی محصولات فروشگاه پوکوپینی اصل و با کیفیت بالا هستند. ما تنها با برندهای معتبر همکاری می‌کنیم و کیفیت محصولات را تضمین می‌کنیم. در صورت وجود هرگونه مشکل، می‌توانید با پشتیبانی تماس بگیرید."
    },
    {
      question: "آیا امکان خرید عمده وجود دارد؟",
      answer: "بله، برای خرید عمده و همکاری‌های تجاری می‌توانید از طریق صفحه تماس با ما یا اینستاگرام با ما در ارتباط باشید. برای خریدهای عمده، تخفیف‌های ویژه‌ای در نظر گرفته شده است."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue via-white to-pastel-pink py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
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
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            سوالات متداول
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            پاسخ سوالات رایج شما در مورد خرید، ارسال و خدمات ما
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-right hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ml-4 transition-all duration-300 ${
                    openIndex === index 
                      ? 'bg-gradient-to-br from-coral to-primary' 
                      : 'bg-gradient-to-br from-pastel-blue to-pastel-green'
                  }`}>
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {faq.question}
                  </h3>
                </div>
                <svg 
                  className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5 pt-2">
                  <div className="pr-14 text-gray-700 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-r from-coral/10 to-primary/10 rounded-2xl p-8 text-center border border-coral/20">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            سوال دیگری دارید؟
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
              href="/order-tracking" 
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-coral to-primary text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium"
            >
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              پیگیری سفارش
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">لینک‌های مفید</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/" className="text-sm text-gray-600 hover:text-coral transition-colors">
              صفحه اصلی
            </a>
            <span className="text-gray-300">|</span>
            <a href="/products" className="text-sm text-gray-600 hover:text-coral transition-colors">
              محصولات
            </a>
            <span className="text-gray-300">|</span>
            <a href="/about" className="text-sm text-gray-600 hover:text-coral transition-colors">
              درباره ما
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

export default FAQ;
