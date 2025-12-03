import React, { memo } from 'react';

const Footer = memo(() => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* لوگو و توضیحات */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="bg-white rounded-full p-2 shadow-lg">
                <img 
                  src="/images/لوگو.jpg" 
                  alt="پوکوپینی" 
                  className="h-14 w-14 rounded-full object-cover"
                />
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed text-lg">
              پوکوپینی، فروشگاه آنلاین تخصصی لباس کودک با بهترین کیفیت و قیمت مناسب. ما با عشق و دقت، بهترین‌ها را برای فرشته‌های کوچک شما انتخاب می‌کنیم.
            </p>
          </div>

          {/* لینک‌های مفید */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">لینک‌های مفید</h3>
            <ul className="space-y-3">
              <li>
                <a href="/about" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center group">
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  درباره ما
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center group">
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  تماس با ما
                </a>
              </li>
              <li>
                <a href="/products" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center group">
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  محصولات
                </a>
              </li>
            </ul>
          </div>

          {/* ارتباط با ما */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">ارتباط با ما</h3>
            <div className="space-y-4">
              {/* Location */}
              <a 
                href="https://maps.google.com/?q=تهران،+خیابان+ولیعصر" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start group hover:translate-x-1 transition-transform"
              >
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center ml-3 flex-shrink-0 group-hover:bg-purple-600/30 transition-colors">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-gray-300 group-hover:text-purple-400 transition-colors">تهران، خیابان ولیعصر</span>
              </a>

              {/* Instagram */}
              <a 
                href="https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=zyt8v4k" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start group hover:translate-x-1 transition-transform"
              >
                <div className="w-10 h-10 bg-pink-600/20 rounded-lg flex items-center justify-center ml-3 flex-shrink-0 group-hover:bg-pink-600/30 transition-colors">
                  <svg className="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <span className="text-gray-300 group-hover:text-pink-400 transition-colors">Instagram</span>
              </a>

              {/* Pinterest */}
              <a 
                href="https://www.pinterest.com/pocopini" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start group hover:translate-x-1 transition-transform"
              >
                <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center ml-3 flex-shrink-0 group-hover:bg-red-600/30 transition-colors">
                  <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                  </svg>
                </div>
                <span className="text-gray-300 group-hover:text-red-400 transition-colors">Pinterest</span>
              </a>
            </div>
          </div>
        </div>

        {/* خط جداکننده */}
        <div className="border-t border-gray-700/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              نوشته و طراحی شده توسط ترنم کمالی پناه
            </p>
            <div className="flex items-center space-x-6 space-x-reverse text-sm text-gray-400">
              <a href="/terms" className="hover:text-purple-400 transition-colors">قوانین و مقررات</a>
              <a href="/privacy" className="hover:text-purple-400 transition-colors">حریم خصوصی</a>
              <a href="/faq" className="hover:text-purple-400 transition-colors">سوالات متداول</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;