import React, { useState, useEffect } from 'react';
import { imageUtils, priceUtils } from '../utils';

const RecentlyViewed = () => {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    // دریافت محصولات اخیراً مشاهده شده از localStorage
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecentProducts(viewed.slice(0, 4)); // نمایش 4 محصول آخر
  }, []);

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-pastel-blue/20 to-pastel-pink/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              اخیراً مشاهده کرده‌اید
            </h2>
            <p className="text-gray-600">بازگشت سریع به محصولات دیده شده</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('recentlyViewed');
              setRecentProducts([]);
            }}
            className="text-sm text-gray-500 hover:text-coral transition-colors"
          >
            پاک کردن همه
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {recentProducts.map((product, index) => (
            <a
              key={product.id}
              href={`/products/${product.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={imageUtils.getProductImageUrl(product)}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={imageUtils.handleImageError}
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                  <span className="text-xs text-gray-600">مشاهده شده</span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-coral transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-coral">
                    {priceUtils.formatPersianPrice(product.price)}
                  </span>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-coral transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed;
