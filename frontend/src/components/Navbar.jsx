import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // هدایت به صفحه جستجو
      window.location.href = `/products?search=${encodeURIComponent(searchTerm)}`;
      setIsSearchOpen(false);
      setSearchTerm('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">
      {/* Top Search Bar */}
      <div className="bg-gradient-to-r from-coral to-primary py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="جستجوی محصولات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-coral transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* منوی سمت راست */}
          <div className="hidden lg:flex items-center space-x-8 space-x-reverse flex-1">
            <a 
              href="/" 
              className="text-gray-700 hover:text-coral text-sm font-medium transition-colors"
            >
              خانه
            </a>
            <div className="relative group">
              <button className="text-gray-700 hover:text-coral text-sm font-medium transition-colors flex items-center">
                محصولات
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {/* منوی کشویی */}
              <div className="absolute right-0 mt-2 w-[500px] bg-white rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100">
                <div className="grid grid-cols-2 divide-x divide-x-reverse divide-gray-100">
                  {/* دخترانه */}
                  <div className="p-4">
                    <div className="flex items-center mb-3 pb-2 border-b border-gray-100">
                      <span className="text-2xl ml-2">👧</span>
                      <h3 className="font-bold text-gray-900">دخترانه</h3>
                    </div>
                    <div className="space-y-1">
                      <a href="/products?category=girl&type=blouse" className="block px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-coral rounded-lg transition-colors">
                        بلوز
                      </a>
                      <a href="/products?category=girl&type=blouse-pants" className="block px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-coral rounded-lg transition-colors">
                        بلوز شلوار
                      </a>
                      <a href="/products?category=girl&type=dress" className="block px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-coral rounded-lg transition-colors">
                        شومیز
                      </a>
                      <a href="/products?category=girl&type=vest-skirt" className="block px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-coral rounded-lg transition-colors">
                        جلیقه و شلوار
                      </a>
                      <a href="/products?category=girl&type=vest" className="block px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-coral rounded-lg transition-colors">
                        جلیقه
                      </a>
                      <a href="/products?category=girl&type=cardigan" className="block px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-coral rounded-lg transition-colors">
                        کاپشن
                      </a>
                      <a href="/products?category=girl&type=baft" className="block px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-coral rounded-lg transition-colors">
                        بافت
                      </a>
                      <a href="/products?category=girl&type=shawl-hat" className="block px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-coral rounded-lg transition-colors">
                        شال و کلاه
                      </a>
                      <a href="/products?category=girl&type=skirt" className="block px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-coral rounded-lg transition-colors">
                        زیله
                      </a>
                    </div>
                  </div>
                  
                  {/* پسرانه */}
                  <div className="p-4">
                    <div className="flex items-center mb-3 pb-2 border-b border-gray-100">
                      <span className="text-2xl ml-2">👦</span>
                      <h3 className="font-bold text-gray-900">پسرانه</h3>
                    </div>
                    <div className="space-y-1">
                      <a href="/products?category=boy&type=blouse" className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-coral rounded-lg transition-colors">
                        بلوز
                      </a>
                      <a href="/products?category=boy&type=blouse-pants" className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-coral rounded-lg transition-colors">
                        بلوز شلوار
                      </a>
                      <a href="/products?category=boy&type=pants" className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-coral rounded-lg transition-colors">
                        شلوار
                      </a>
                      <a href="/products?category=boy&type=sweatshirt" className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-coral rounded-lg transition-colors">
                        سویشرت
                      </a>
                      <a href="/products?category=boy&type=coat-pants" className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-coral rounded-lg transition-colors">
                        کت و شلوار
                      </a>
                      <a href="/products?category=boy&type=overall" className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-coral rounded-lg transition-colors">
                        سرهمی
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <a 
              href="/about" 
              className="text-gray-700 hover:text-coral text-sm font-medium transition-colors"
            >
              درباره ما
            </a>
          </div>

          {/* لوگو در وسط */}
          <div className="flex items-center justify-center flex-shrink-0">
            <a href="/" className="flex items-center">
              <img 
                src="/images/لوگو.jpg" 
                alt="پوکوپینی" 
                className="h-12 w-auto"
              />
            </a>
          </div>

          {/* منوی سمت چپ */}
          <div className="hidden lg:flex items-center space-x-6 space-x-reverse flex-1 justify-end">
            {/* سبد خرید */}
            <a href="/cart" className="relative p-2 text-gray-700 hover:text-coral transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-coral text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </a>

            {/* ورود/خروج */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-1.5 space-x-reverse text-gray-700 hover:text-coral transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-coral to-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'ک'}
                    </span>
                  </div>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* منوی کاربر */}
                {isMenuOpen && (
                  <div className="absolute left-0 mt-3 w-52 bg-white rounded-xl shadow-2xl z-50 border border-gray-100">
                    <div className="py-2">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.first_name || user?.username}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <a href="/profile" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-pastel-green transition-colors">
                        <svg className="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        پروفایل
                      </a>
                      {user?.is_staff && (
                        <a href="/admin" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 transition-colors">
                          <svg className="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          پنل مدیریت
                        </a>
                      )}
                      <a href="/orders" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-pastel-green transition-colors">
                        <svg className="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        سفارشات من
                      </a>
                      <a href="/addresses" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-pastel-green transition-colors">
                        <svg className="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        آدرس‌ها
                      </a>
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-right px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        خروج
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3 space-x-reverse">
                <a
                  href="/login"
                  className="text-gray-700 hover:text-coral text-sm font-medium transition-colors"
                >
                  ورود
                </a>
                <a
                  href="/register"
                  className="bg-coral text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-primary transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  ثبت‌نام
                </a>
              </div>
            )}
          </div>

          {/* دکمه منوی موبایل */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-coral transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* منوی موبایل */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100">
            <div className="px-4 pt-4 pb-6 space-y-3 bg-white">
              {/* جستجو در موبایل */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="جستجو..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:border-coral transition-colors bg-gray-50"
                  />
                  <button
                    type="submit"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-coral"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>

              <a href="/" className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-coral hover:bg-pastel-pink/20 rounded-lg transition-colors">
                خانه
              </a>
              
              <div className="space-y-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">دسته‌بندی‌ها</div>
                <a href="/products?category=baby" className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-coral hover:bg-pastel-pink/20 rounded-lg transition-colors">
                  <span className="text-xl ml-3">👶</span>
                  نوزاد
                </a>
                <a href="/products?category=girl" className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-coral hover:bg-pastel-pink/20 rounded-lg transition-colors">
                  <span className="text-xl ml-3">👧</span>
                  دخترانه
                </a>
                <a href="/products?category=boy" className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-coral hover:bg-pastel-pink/20 rounded-lg transition-colors">
                  <span className="text-xl ml-3">👦</span>
                  پسرانه
                </a>
              </div>

              <hr className="my-4 border-gray-100" />

              <a href="/about" className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-coral hover:bg-pastel-pink/20 rounded-lg transition-colors">
                درباره ما
              </a>
              <a href="/contact" className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-coral hover:bg-pastel-pink/20 rounded-lg transition-colors">
                تماس با ما
              </a>

              {!isAuthenticated && (
                <div className="pt-4 space-y-2">
                  <a href="/login" className="block text-center px-4 py-3 text-base font-medium text-gray-700 border border-gray-200 rounded-full hover:border-coral hover:text-coral transition-colors">
                    ورود
                  </a>
                  <a href="/register" className="block text-center px-4 py-3 text-base font-medium text-white bg-coral rounded-full hover:bg-primary transition-colors">
                    ثبت‌نام
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* overlay برای بستن منو */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* مودال جستجو برای دسکتاپ */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsSearchOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl">
            <form onSubmit={handleSearch} className="p-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="جستجوی محصولات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-coral transition-colors"
                />
                <button
                  type="submit"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-coral transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-4 text-sm text-gray-500 text-center">
                برای جستجو Enter را فشار دهید
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;