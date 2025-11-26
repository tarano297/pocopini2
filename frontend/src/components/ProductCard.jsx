import React, { useState, memo } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { priceUtils, imageUtils } from '../utils';
import LazyImage from './LazyImage';

const ProductCard = ({ product, className = '' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('خطا در افزودن به سبد خرید:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getCategoryLabel = (category) => {
    const categories = {
      'baby': 'نوزاد',
      'girl': 'دخترانه',
      'boy': 'پسرانه'
    };
    return categories[category] || category;
  };

  const getSeasonLabel = (season) => {
    const seasons = {
      'winter': 'زمستان',
      'spring': 'بهار',
      'summer': 'تابستان',
      'fall': 'پاییز'
    };
    return seasons[season] || season;
  };

  const inCart = isInCart(product.id);
  const quantity = getItemQuantity(product.id);

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${className}`}>
      <a href={`/products/${product.id}`} className="block">
        {/* تصویر محصول */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {!imageError ? (
            <LazyImage
              src={imageUtils.getProductImageUrl(product)}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* برچسب دسته‌بندی */}
          <div className="absolute top-2 right-2">
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {getCategoryLabel(product.category)}
            </span>
          </div>

          {/* برچسب فصل */}
          <div className="absolute top-2 left-2">
            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
              {getSeasonLabel(product.season)}
            </span>
          </div>

          {/* برچسب موجودی */}
          {!product.is_in_stock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                ناموجود
              </span>
            </div>
          )}
        </div>

        {/* اطلاعات محصول */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* تنوع محصول */}
          {product.variants_count > 0 && (
            <div className="mb-3 text-sm text-gray-500">
              {product.variants_count} رنگ و سایز موجود
            </div>
          )}

          {/* قیمت */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-bold text-gray-900">
              {product.min_price === product.max_price ? (
                priceUtils.formatPersianPrice(product.price)
              ) : (
                <>
                  {priceUtils.formatPersianPrice(product.min_price)} - {priceUtils.formatPersianPrice(product.max_price)}
                </>
              )}
            </div>
          </div>
        </div>
      </a>

      {/* دکمه افزودن به سبد */}
      <div className="px-4 pb-4">
        {product.is_in_stock ? (
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                inCart
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  در حال افزودن...
                </div>
              ) : inCart ? (
                <div className="flex items-center justify-center">
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  در سبد ({priceUtils.toPersianDigits(quantity)})
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0V19a2 2 0 002 2h7a2 2 0 002-2v-.5" />
                  </svg>
                  افزودن به سبد
                </div>
              )}
            </button>
            
            {/* دکمه علاقه‌مندی */}
            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            disabled
            className="w-full py-2 px-4 bg-gray-300 text-gray-500 rounded-md text-sm font-medium cursor-not-allowed"
          >
            ناموجود
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(ProductCard);