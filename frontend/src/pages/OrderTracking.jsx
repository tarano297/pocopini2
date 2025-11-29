import React, { useState } from 'react';

const OrderTracking = () => {
  const [isHovered, setIsHovered] = useState(false);
  const instagramLink = "https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=zyt8v4k";

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-pink via-white to-pastel-blue py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="inline-block mb-6">
            <div className="relative animate-float">
              <div className="absolute inset-0 bg-coral blur-2xl opacity-20 animate-pulse-slow"></div>
              <svg 
                className="w-24 h-24 mx-auto text-coral relative z-10 animate-bounce-slow" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" 
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-slide-up">
            پیگیری سفارشات
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-slide-up-delay">
            برای پیگیری وضعیت سفارش خود، فاکتور خرید را به صفحه اینستاگرام ما ارسال کنید
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl animate-scale-in">
          {/* Decorative Top Border */}
          <div className="h-2 bg-gradient-to-r from-coral via-primary to-pastel-purple animate-gradient"></div>
          
          <div className="p-8 md:p-12">
            {/* Steps Section */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Step 1 */}
              <div className="text-center group animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-pastel-pink rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse-slow"></div>
                  <div className="relative bg-gradient-to-br from-pastel-pink to-coral w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <span className="text-3xl animate-wiggle">📋</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">مرحله اول</h3>
                <p className="text-sm text-gray-600">فاکتور خرید خود را آماده کنید</p>
              </div>

              {/* Step 2 */}
              <div className="text-center group animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse-slow"></div>
                  <div className="relative bg-gradient-to-br from-primary to-pastel-purple w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <span className="text-3xl animate-wiggle">📸</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">مرحله دوم</h3>
                <p className="text-sm text-gray-600">فاکتور را دانلود یا چاپ کنید</p>
                <p className="text-sm text-gray-600">عکس یا اسکرین‌شات فاکتور بگیرید</p>
              </div>

              {/* Step 3 */}
              <div className="text-center group animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-pastel-purple rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse-slow"></div>
                  <div className="relative bg-gradient-to-br from-pastel-purple to-coral w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <span className="text-3xl animate-wiggle">📱</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">مرحله سوم</h3>
                <p className="text-sm text-gray-600">به اینستاگرام ما ارسال کنید</p>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-12">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-100"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-6 text-sm text-gray-500 font-medium">
                  آماده برای پیگیری؟
                </span>
              </div>
            </div>

            {/* Instagram Button */}
            <div className="text-center">
              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="inline-flex items-center justify-center px-12 py-5 text-lg font-bold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-size-200 bg-pos-0 hover:bg-pos-100 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 group"
              >
                <svg 
                  className={`w-8 h-8 ml-3 transition-transform duration-500 ${isHovered ? 'rotate-12 scale-110' : ''}`}
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>ارسال به اینستاگرام</span>
                <svg 
                  className={`w-6 h-6 mr-3 transition-transform duration-500 ${isHovered ? 'translate-x-2' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </a>
              
              <p className="mt-6 text-sm text-gray-500">
                پاسخ شما در کمترین زمان ممکن ارسال خواهد شد
              </p>
            </div>

            {/* Info Box */}
            <div className="mt-12 bg-gradient-to-r from-pastel-blue/30 to-pastel-green/30 rounded-2xl p-6 border border-pastel-blue/50 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-primary animate-pulse-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="mr-4">
                  <h4 className="text-base font-bold text-gray-900 mb-2">نکات مهم:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start animate-slide-in-right" style={{animationDelay: '1s'}}>
                      <span className="text-coral ml-2">•</span>
                      <span>شماره سفارش خود را در پیام ذکر کنید</span>
                    </li>
                    <li className="flex items-start animate-slide-in-right" style={{animationDelay: '1.1s'}}>
                      <span className="text-coral ml-2">•</span>
                      <span>تصویر فاکتور باید واضح و خوانا باشد</span>
                    </li>
                    <li className="flex items-start animate-slide-in-right" style={{animationDelay: '1.2s'}}>
                      <span className="text-coral ml-2">•</span>
                      <span>پاسخگویی 24 ساعته</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Help Section */}
        <div className="mt-12 text-center animate-fade-in" style={{animationDelay: '1s'}}>
          <p className="text-gray-600 mb-4">سوال یا مشکلی دارید؟</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/contact" 
              className="inline-flex items-center px-6 py-3 bg-white text-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:text-coral hover:-translate-y-1 animate-fade-in-up" 
              style={{animationDelay: '1.2s'}}
            >
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              تماس با ما
            </a>
            <a 
              href="/faq" 
              className="inline-flex items-center px-6 py-3 bg-white text-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:text-coral hover:-translate-y-1 animate-fade-in-up" 
              style={{animationDelay: '1.3s'}}
            >
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              سوالات متداول
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes wiggle {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-5deg);
          }
          75% {
            transform: rotate(5deg);
          }
        }
        
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }
        
        .animate-slide-up-delay {
          animation: slide-up 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s ease-out 0.3s forwards;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .bg-size-200 {
          background-size: 200% auto;
        }
        
        .bg-pos-0 {
          background-position: 0% center;
        }
        
        .hover\\:bg-pos-100:hover {
          background-position: 100% center;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default OrderTracking;
