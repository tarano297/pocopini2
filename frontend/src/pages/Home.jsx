import React, { useState, useEffect } from 'react';
import { ProductCard, LoadingSpinner, ErrorMessage, LazyImage, RecentlyViewed, ScrollAnimation } from '../components';
import productService from '../services/productService';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    comment: ''
  });
  const [userReviews, setUserReviews] = useState([]);

  useEffect(() => {
    loadFeaturedProducts();
    // بارگذاری نظرات از localStorage
    const savedReviews = localStorage.getItem('userReviews');
    if (savedReviews) {
      setUserReviews(JSON.parse(savedReviews));
    }
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setIsLoading(true);
      const products = await productService.getFeaturedProducts();
      setFeaturedProducts(products.results || products);
    } catch (err) {
      setError(err.message || 'خطا در بارگذاری محصولات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('لطفاً امتیاز خود را انتخاب کنید');
      return;
    }
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) {
      alert('لطفاً تمام فیلدها را پر کنید');
      return;
    }
    
    // اضافه کردن نظر جدید به لیست
    const newReview = {
      id: Date.now(),
      name: reviewForm.name,
      comment: reviewForm.comment,
      rating: rating,
      date: new Date().toLocaleDateString('fa-IR')
    };
    
    const updatedReviews = [newReview, ...userReviews];
    setUserReviews(updatedReviews);
    
    // ذخیره در localStorage
    localStorage.setItem('userReviews', JSON.stringify(updatedReviews));
    
    alert('نظر شما با موفقیت ثبت شد! 🎉');
    
    // ریست کردن فرم
    setRating(0);
    setReviewForm({ name: '', comment: '' });
  };

  const categories = [
    {
      id: 'baby',
      name: 'نوزاد',
      description: 'لباس‌های نرم و راحت برای نوزادان',
      image: '/categories/baby.jpg',
      color: 'bg-pink-100 hover:bg-pink-200'
    },
    {
      id: 'girl',
      name: 'دخترانه',
      description: 'مدل‌های زیبا و شیک برای دختران',
      image: '/categories/girl.jpg',
      color: 'bg-purple-100 hover:bg-purple-200'
    },
    {
      id: 'boy',
      name: 'پسرانه',
      description: 'طراحی‌های جذاب برای پسران',
      image: '/categories/boy.jpg',
      color: 'bg-blue-100 hover:bg-blue-200'
    }
  ];

  const seasons = [
    {
      id: 'spring',
      name: 'بهار',
      emoji: '🌸',
      description: 'لباس‌های سبک و رنگارنگ',
      color: 'from-pastel-green to-accent',
      bgColor: 'bg-pastel-green'
    },
    {
      id: 'summer',
      name: 'تابستان',
      emoji: '☀️',
      description: 'پوشاک خنک و راحت',
      color: 'from-accent to-cream',
      bgColor: 'bg-accent/30'
    },
    {
      id: 'autumn',
      name: 'پاییز',
      emoji: '🍂',
      description: 'لباس‌های گرم و دلنشین',
      color: 'from-coral to-primary',
      bgColor: 'bg-coral/30'
    },
    {
      id: 'winter',
      name: 'زمستان',
      emoji: '❄️',
      description: 'پوشاک گرم و ضدسرما',
      color: 'from-pastel-pink to-primary-light',
      bgColor: 'bg-pastel-pink'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Inspired by Carter's & Gap Kids */}
      <section className="relative bg-gradient-to-br from-pastel-green via-white to-pastel-pink overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 right-10 w-32 h-32 bg-accent rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-coral rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-success rounded-full opacity-20 blur-2xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
            {/* Text Content */}
            <div className="text-right lg:text-right order-2 lg:order-1">
              <div className="inline-flex items-center bg-gradient-to-r from-coral to-primary-light text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
                <span className="ml-2">🎁</span>
                تخفیف ویژه برای خرید اول
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
                لباس‌های
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-coral to-primary">
                  شاد و راحت
                </span>
                برای کودکان
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl">
                کیفیت برتر، طراحی منحصر به فرد و قیمت مناسب. همه چیز برای خوشحالی کودک شما در یک مکان.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/products"
                  className="group inline-flex items-center justify-center bg-gradient-to-r from-coral to-primary text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  خرید کنید
                  <svg className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </a>
                <a
                  href="/products"
                  className="inline-flex items-center justify-center border-2 border-coral text-coral px-8 py-4 rounded-full font-bold text-lg hover:bg-coral hover:text-white transition-all duration-300"
                >
                  مشاهده کالکشن‌ها
                </a>
              </div>
              
              {/* Trust Indicators */}
              <div className="mt-12 flex flex-wrap gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  ضمانت بازگشت
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  پشتیبانی ۲۴/۷
                </div>
              </div>
            </div>
            
            {/* Hero Image/Illustration */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                {/* Hero image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl animate-float-slow">
                  <LazyImage 
                    src="/images/photo1.png" 
                    alt="کالکشن جدید بهار و تابستان" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Decorative Elements */}
        <div className="absolute top-20 left-10 animate-float pointer-events-none">
          <div className="w-8 h-8 bg-accent rounded-full opacity-70 animate-pulse"></div>
        </div>
        <div className="absolute top-40 right-20 animate-float-slow pointer-events-none" style={{animationDelay: '1s'}}>
          <div className="w-6 h-6 bg-pastel-pink rounded-full opacity-70 animate-pulse"></div>
        </div>
        <div className="absolute bottom-20 left-1/4 animate-float-slower pointer-events-none" style={{animationDelay: '2s'}}>
          <div className="w-4 h-4 bg-success rounded-full opacity-70 animate-pulse"></div>
        </div>
        <div className="absolute top-1/2 right-10 animate-float pointer-events-none" style={{animationDelay: '0.5s'}}>
          <div className="w-5 h-5 bg-coral rounded-full opacity-60 animate-spin-slow"></div>
        </div>
        <div className="absolute bottom-40 right-1/3 animate-float-slow pointer-events-none" style={{animationDelay: '1.5s'}}>
          <div className="w-7 h-7 bg-cream rounded-full opacity-50 animate-pulse"></div>
        </div>
      </section>

      {/* Categories Section - Clean & Modern */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
              خرید بر اساس سن
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              محصولات مناسب برای هر سنی
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <a
                key={category.id}
                href={`/products?category=${category.id}`}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-2xl transition-all duration-300 animate-scale-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {/* Image Container */}
                <div className="aspect-[4/5] relative overflow-hidden">
                  <LazyImage 
                    src={`/images/photo${category.id === 'baby' ? '2' : category.id === 'girl' ? '3' : '4'}.png`}
                    alt={category.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-500"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                  {/* Badge */}
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow-lg animate-bounce-slow">
                    جدید
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 bg-white">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center text-pink-600 font-semibold group-hover:text-purple-600 transition-colors">
                    خرید کنید
                    <svg className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Season Categories Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
              خرید بر اساس فصل
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              لباس‌های مناسب برای هر فصل از سال
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Spring */}
            <a
              href="/products?season=spring"
              className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl animate-scale-in"
              style={{animationDelay: '0s'}}
            >
              <div className="h-48 md:h-64 relative">
                <LazyImage 
                  src="/images/بهار.png" 
                  alt="بهار"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
              </div>
            </a>

            {/* Summer */}
            <a
              href="/products?season=summer"
              className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl animate-scale-in"
              style={{animationDelay: '0.1s'}}
            >
              <div className="h-48 md:h-64 relative">
                <LazyImage 
                  src="/images/تابستان.png" 
                  alt="تابستان"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
              </div>
            </a>

            {/* Autumn */}
            <a
              href="/products?season=autumn"
              className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl animate-scale-in"
              style={{animationDelay: '0.2s'}}
            >
              <div className="h-48 md:h-64 relative">
                <LazyImage 
                  src="/images/پاییز.png" 
                  alt="پاییز"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
              </div>
            </a>

            {/* Winter */}
            <a
              href="/products?season=winter"
              className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl animate-scale-in"
              style={{animationDelay: '0.3s'}}
            >
              <div className="h-48 md:h-64 relative">
                <LazyImage 
                  src="/images/زمستان.png" 
                  alt="زمستان"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
              </div>
            </a>
          </div>

          {/* Seasonal Highlights */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-pastel-green to-accent/30 rounded-2xl p-8 animate-slide-right">
              <div className="flex items-center mb-4">
                <span className="text-4xl ml-4">🌸</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">کالکشن بهاره</h3>
                  <p className="text-sm text-gray-600">تازه‌ترین مدل‌های فصل</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                لباس‌های سبک و رنگارنگ برای روزهای گرم بهار
              </p>
              <a href="/products?season=spring" className="inline-flex items-center text-coral font-semibold hover:text-primary transition-colors">
                مشاهده همه
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </a>
            </div>

            <div className="bg-gradient-to-r from-pastel-pink to-coral/30 rounded-2xl p-8 animate-slide-left">
              <div className="flex items-center mb-4">
                <span className="text-4xl ml-4">❄️</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">کالکشن زمستانه</h3>
                  <p className="text-sm text-gray-600">گرم و راحت</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                لباس‌های گرم و ضدسرما برای روزهای سرد زمستان
              </p>
              <a href="/products?season=winter" className="inline-flex items-center text-coral font-semibold hover:text-primary transition-colors">
                مشاهده همه
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="relative overflow-hidden">
        <video 
          className="w-full h-auto"
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src="/videos/pocopini.mp4" type="video/mp4" />
        </video>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-2">
                محصولات پرفروش
              </h2>
              <p className="text-lg text-gray-600">
                محبوب‌ترین انتخاب‌های مشتریان ما
              </p>
            </div>
            <a
              href="/products"
              className="hidden md:inline-flex items-center text-pink-600 font-semibold hover:text-purple-600 transition-colors"
            >
              مشاهده همه
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" />
            </div>
          ) : error ? (
            <ErrorMessage 
              error={error} 
              onRetry={loadFeaturedProducts}
              className="max-w-md mx-auto"
            />
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.slice(0, 8).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-500 text-lg">هنوز محصولی اضافه نشده است</p>
            </div>
          )}

          {featuredProducts.length > 0 && (
            <div className="text-center mt-12">
              <a
                href="/products"
                className="inline-block bg-gray-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                مشاهده همه محصولات
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us - Minimalist Style */}
      <section className="py-16 md:py-24 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
              چرا پوکوپینی؟
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              تجربه خریدی آسان، سریع و مطمئن
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 bg-pastel-pink rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow hover:animate-wiggle">
                <svg className="w-8 h-8 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">کیفیت برتر</h3>
              <p className="text-gray-600 text-sm">پارچه‌های طبیعی و راحت</p>
            </div>

            <div className="text-center animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 bg-accent/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow hover:animate-wiggle">
                <svg className="w-8 h-8 text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">ارسال رایگان بالای خرید ۵ میلیون تومان</h3>
              <p className="text-gray-600 text-sm">ارسال سریع و مطمئن</p>
            </div>

            <div className="text-center animate-slide-up" style={{animationDelay: '0.3s'}}>
              <div className="w-16 h-16 bg-pastel-green rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow hover:animate-wiggle">
                <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">خرید امن</h3>
              <p className="text-gray-600 text-sm">پرداخت آنلاین با درگاه معتبر</p>
            </div>

            <div className="text-center animate-slide-up" style={{animationDelay: '0.4s'}}>
              <div className="w-16 h-16 bg-success/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow hover:animate-wiggle">
                <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">بازگشت آسان</h3>
              <p className="text-gray-600 text-sm">۷ روز ضمانت بازگشت کالا</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section - Carousel Style */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
              نظرات مشتریان ما
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              رضایت شما، افتخار ماست
            </p>
          </div>

          {/* Scrollable Reviews Container */}
          <div className="relative">
            {/* Scroll Hint - Left */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-l from-transparent to-white z-10 pointer-events-none hidden md:block"></div>
            
            {/* Scroll Hint - Right */}
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white z-10 pointer-events-none hidden md:block"></div>

            {/* Reviews Carousel */}
            <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              {/* نظرات کاربران جدید */}
              {userReviews.map((review, index) => (
                <div 
                  key={review.id} 
                  className="flex-shrink-0 w-[85%] sm:w-[400px] snap-center"
                >
                  <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-purple-200 h-full transform hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {review.name.charAt(0)}
                        </div>
                        <div className="mr-3">
                          <h4 className="font-bold text-gray-900 text-lg">{review.name}</h4>
                          <div className="flex text-accent text-lg">
                            {'⭐'.repeat(review.rating)}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-purple-600 font-semibold bg-purple-100 px-3 py-1 rounded-full animate-pulse">جدید</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-base mb-4">
                      "{review.comment}"
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-200">
                      <span>{review.date}</span>
                      <span className="text-purple-600">✓ خرید تایید شده</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Review 1 */}
              <div className="flex-shrink-0 w-[85%] sm:w-[400px] snap-center">
                <div className="bg-gradient-to-br from-pastel-green to-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 h-full transform hover:scale-105">
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-coral to-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      س
                    </div>
                    <div className="mr-3">
                      <h4 className="font-bold text-gray-900 text-lg">سارا احمدی</h4>
                      <div className="flex text-accent text-lg">
                        {'⭐'.repeat(5)}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-base mb-4">
                    "کیفیت لباس‌ها عالی بود و پارچه‌هاش خیلی نرم و راحت. بچه‌م خیلی راحت بود و پوستش حساسیت نگرفت. قطعاً دوباره خرید می‌کنم!"
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-200">
                    <span>۱۴۰۲/۰۸/۱۵</span>
                    <span className="text-green-600">✓ خرید تایید شده</span>
                  </div>
                </div>
              </div>

              {/* Review 2 */}
              <div className="flex-shrink-0 w-[85%] sm:w-[400px] snap-center">
                <div className="bg-gradient-to-br from-pastel-pink to-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 h-full transform hover:scale-105">
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-accent to-cream rounded-full flex items-center justify-center text-gray-900 font-bold text-xl shadow-lg">
                      م
                    </div>
                    <div className="mr-3">
                      <h4 className="font-bold text-gray-900 text-lg">مریم رضایی</h4>
                      <div className="flex text-accent text-lg">
                        {'⭐'.repeat(5)}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-base mb-4">
                    "ارسال سریع و بسته‌بندی عالی. مدل‌ها خیلی شیک و متنوع بودن. قیمت‌ها هم نسبت به کیفیت خیلی مناسب بود. ممنون از تیم پوکوپینی 💕"
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-200">
                    <span>۱۴۰۲/۰۹/۰۲</span>
                    <span className="text-green-600">✓ خرید تایید شده</span>
                  </div>
                </div>
              </div>

              {/* Review 3 */}
              <div className="flex-shrink-0 w-[85%] sm:w-[400px] snap-center">
                <div className="bg-gradient-to-br from-cream/30 to-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 h-full transform hover:scale-105">
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-success to-pastel-green rounded-full flex items-center justify-center text-gray-900 font-bold text-xl shadow-lg">
                      ز
                    </div>
                    <div className="mr-3">
                      <h4 className="font-bold text-gray-900 text-lg">زهرا کریمی</h4>
                      <div className="flex text-accent text-lg">
                        {'⭐'.repeat(5)}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-base mb-4">
                    "سایت خیلی راحت و کاربردی بود. پشتیبانی هم عالی و سریع جواب میدن. لباس‌ها دقیقاً مثل عکس بودن. خیلی راضی هستم 🌟"
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-200">
                    <span>۱۴۰۲/۰۹/۱۰</span>
                    <span className="text-green-600">✓ خرید تایید شده</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll Instruction */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                برای مشاهده نظرات بیشتر به چپ و راست بکشید
                <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </p>
            </div>
          </div>

          {/* Trust Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-black text-coral mb-2">۹۸٪</div>
              <div className="text-sm text-gray-600">رضایت مشتریان</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-coral mb-2">۵۰۰+</div>
              <div className="text-sm text-gray-600">نظر مثبت</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-coral mb-2">۱۰۰۰+</div>
              <div className="text-sm text-gray-600">مشتری راضی</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-coral mb-2">۴.۹</div>
              <div className="text-sm text-gray-600">امتیاز از ۵</div>
            </div>
          </div>

          {/* Submit Review Section */}
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-pastel-green to-pastel-pink/30 rounded-3xl p-8 md:p-12 shadow-xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
                  نظر شما برای ما مهم است
                </h3>
                <p className="text-gray-600">
                  تجربه خود را با ما و دیگران به اشتراک بگذارید
                </p>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-6">
                {/* Star Rating */}
                <div className="text-center">
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    امتیاز شما
                  </label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-4xl hover:scale-125 transition-transform duration-200 focus:outline-none"
                      >
                        {star <= (hoverRating || rating) ? '⭐' : '☆'}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {rating > 0 ? `${rating} ستاره انتخاب شده` : 'روی ستاره‌ها کلیک کنید'}
                  </p>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    نام شما
                  </label>
                  <input
                    type="text"
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                    placeholder="نام و نام خانوادگی"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-coral transition-colors bg-white"
                    required
                  />
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    نظر شما
                  </label>
                  <textarea
                    rows="4"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    placeholder="تجربه خود را با ما به اشتراک بگذارید..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-coral transition-colors bg-white resize-none"
                    required
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    {reviewForm.comment.length} / 500 کاراکتر
                  </p>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-coral to-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={rating === 0 || !reviewForm.name.trim() || !reviewForm.comment.trim()}
                  >
                    ثبت نظر
                  </button>
                </div>
              </form>

              {/* Benefits */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <svg className="w-5 h-5 text-coral ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  نظر شما منتشر می‌شود
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <svg className="w-5 h-5 text-coral ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  کمک به خریداران
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <svg className="w-5 h-5 text-coral ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  کد تخفیف ویژه
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gift Guide Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-pastel-pink/30 to-pastel-green/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <span className="inline-block bg-coral text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                🎁 راهنمای هدیه
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
                هدیه مناسب برای هر مناسبتی
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                نمی‌دونید چه هدیه‌ای برای کودک عزیزتون بخرید؟ ما به شما کمک می‌کنیم بهترین انتخاب رو داشته باشید.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-coral rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div className="mr-3">
                    <h4 className="font-bold text-gray-900 mb-1">هدیه تولد</h4>
                    <p className="text-gray-600 text-sm">ست‌های کامل و شیک برای جشن تولد</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-coral rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div className="mr-3">
                    <h4 className="font-bold text-gray-900 mb-1">هدیه نوزادی</h4>
                    <p className="text-gray-600 text-sm">بسته‌های ویژه برای نوزادان</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-coral rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div className="mr-3">
                    <h4 className="font-bold text-gray-900 mb-1">هدیه مناسبتی</h4>
                    <p className="text-gray-600 text-sm">لباس‌های مجلسی و رسمی</p>
                  </div>
                </div>
              </div>

              <a
                href="/gift-guide"
                className="inline-block bg-coral text-white px-8 py-4 rounded-full font-bold hover:bg-primary transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                مشاهده راهنمای هدیه
              </a>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="bg-gradient-to-br from-coral/20 to-primary/20 rounded-3xl p-12 text-center animate-float-slow">
                  <div className="text-9xl mb-4">🎁</div>
                  <div className="text-2xl font-bold text-gray-800">پیشنهاد ویژه</div>
                  <div className="text-lg text-gray-600 mt-2">بسته‌بندی هدیه رایگان</div>
                </div>
                <div className="absolute -top-4 -right-4 bg-accent text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg animate-bounce-slow">
                  رایگان
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed Section */}
      <RecentlyViewed />
    </div>
  );
};

export default Home;