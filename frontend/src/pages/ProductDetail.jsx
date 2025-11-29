import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';
import { LoadingSpinner, ErrorMessage } from '../components';
import ProductReviews from '../components/ProductReviews';
import { priceUtils, imageUtils, recentlyViewedUtils } from '../utils';
import { ShareButton } from '../components';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}/`);
      setProduct(response.data);
      setSelectedSize(response.data.size || '');
      setSelectedColor(response.data.color || '');
      setError(null);
    } catch (err) {
      console.error('خطا در دریافت محصول:', err);
      setError('محصول مورد نظر یافت نشد');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
    
    // چک کردن اینکه آیا محصول در علاقه‌مندی‌ها هست
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(parseInt(id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // افزودن محصول به recently viewed
  useEffect(() => {
    if (product) {
      recentlyViewedUtils.addProduct(product);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      alert('لطفاً سایز و رنگ را انتخاب کنید');
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product.id, quantity);
      alert('محصول به سبد خرید اضافه شد');
    } catch (err) {
      console.error('خطا در افزودن به سبد:', err);
      alert('خطا در افزودن به سبد خرید');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleFavorite = () => {
    if (!product) {
      console.log('محصول هنوز بارگذاری نشده');
      return;
    }
    
    console.log('Toggle favorite clicked', { productId: product.id, currentState: isFavorite });
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (!isFavorite) {
      // اضافه کردن به علاقه‌مندی‌ها
      if (!favorites.includes(product.id)) {
        favorites.push(product.id);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        console.log('Added to favorites:', favorites);
      }
      setIsFavorite(true);
      alert('محصول به علاقه‌مندی‌ها اضافه شد ❤️');
    } else {
      // حذف از علاقه‌مندی‌ها
      const newFavorites = favorites.filter(fav => fav !== product.id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      console.log('Removed from favorites:', newFavorites);
      setIsFavorite(false);
      alert('محصول از علاقه‌مندی‌ها حذف شد');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ErrorMessage error={error || 'محصول یافت نشد'} />
          <button
            onClick={() => navigate('/products')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            بازگشت به محصولات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2 space-x-reverse text-gray-500">
            <li>
              <a href="/" className="hover:text-coral transition-colors">خانه</a>
            </li>
            <li>/</li>
            <li>
              <a href="/products" className="hover:text-coral transition-colors">محصولات</a>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{product?.name}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-10">
            {/* تصویر محصول */}
            <div className="relative">
              <div className="sticky top-8">
                <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center">
                  <img
                    src={imageUtils.getProductImageUrl(product)}
                    alt={product.name}
                    className="w-full h-auto max-h-[500px] object-contain rounded-lg"
                    onError={imageUtils.handleImageError}
                  />
                </div>
                {product.stock === 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                    ناموجود
                  </div>
                )}
                {product.is_featured && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-coral to-primary text-white px-4 py-2 rounded-full font-bold shadow-lg">
                    ویژه
                  </div>
                )}
              </div>
            </div>

            {/* اطلاعات محصول */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
                  {product.name}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex text-accent text-lg">
                      {'⭐'.repeat(5)}
                    </div>
                    <span className="text-sm text-gray-600 mr-2">(۴.۸ از ۵)</span>
                  </div>
                  <span className="text-sm text-gray-500">|</span>
                  <span className="text-sm text-gray-600">۱۲۳ نظر</span>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="bg-gradient-to-r from-pastel-pink/30 to-pastel-green/30 rounded-xl p-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-black text-gray-900">
                    {priceUtils.formatPersianPrice(product.price)}
                  </span>
                  <span className="text-gray-500 line-through text-xl">
                    {priceUtils.formatPersianPrice(product.price * 1.2)}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  {product.stock > 0 ? (
                    <>
                      <span className="flex items-center text-green-600 font-medium">
                        <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        موجود در انبار
                      </span>
                      <span className="text-sm text-gray-600">
                        ({priceUtils.toPersianDigits(product.stock)} عدد)
                      </span>
                    </>
                  ) : (
                    <span className="flex items-center text-red-600 font-medium">
                      <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      ناموجود
                    </span>
                  )}
                </div>
              </div>

              {/* انتخاب سایز */}
              <div className="bg-white border-2 border-gray-100 rounded-xl p-5">
                <label className="block text-base font-bold text-gray-900 mb-3">
                  انتخاب سایز
                  {selectedSize && <span className="text-sm font-normal text-gray-600 mr-2">(سایز {selectedSize})</span>}
                </label>
                <div className="flex flex-wrap gap-3">
                  {['۱', '۲', '۳', '۴', '۵'].map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[60px] px-4 py-3 border-2 rounded-lg font-bold text-lg transition-all ${
                        selectedSize === size
                          ? 'border-coral bg-coral text-white shadow-md scale-105'
                          : 'border-gray-200 hover:border-coral hover:bg-coral/5'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* انتخاب رنگ */}
              <div className="bg-white border-2 border-gray-100 rounded-xl p-5">
                <label className="block text-base font-bold text-gray-900 mb-3">
                  انتخاب رنگ
                  {selectedColor && <span className="text-sm font-normal text-gray-600 mr-2">({selectedColor})</span>}
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: 'مشکی', hex: '#000000' },
                    { name: 'سفید', hex: '#FFFFFF' },
                    { name: 'آبی', hex: '#3B82F6' },
                    { name: 'قرمز', hex: '#EF4444' },
                    { name: 'سبز', hex: '#10B981' },
                    { name: 'صورتی', hex: '#EC4899' },
                    { name: 'زرد', hex: '#F59E0B' },
                    { name: 'بنفش', hex: '#8B5CF6' }
                  ].map(color => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-12 h-12 rounded-full border-4 transition-all transform hover:scale-110 ${
                        selectedColor === color.name
                          ? 'border-coral shadow-lg scale-110'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ 
                        backgroundColor: color.hex,
                        boxShadow: selectedColor === color.name ? `0 0 0 2px white, 0 0 0 4px ${color.hex}` : 'none'
                      }}
                      title={color.name}
                    >
                      {color.name === 'سفید' && (
                        <span className="block w-full h-full rounded-full border border-gray-200"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* انتخاب تعداد */}
              <div className="bg-white border-2 border-gray-100 rounded-xl p-5">
                <label className="block text-base font-bold text-gray-900 mb-3">
                  تعداد
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-full bg-gray-100 hover:bg-coral hover:text-white transition-all flex items-center justify-center font-bold text-xl"
                  >
                    -
                  </button>
                  <span className="min-w-[60px] text-center text-2xl font-bold text-gray-900">
                    {priceUtils.toPersianDigits(quantity)}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-12 h-12 rounded-full bg-gray-100 hover:bg-coral hover:text-white transition-all flex items-center justify-center font-bold text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* دکمه‌های اقدام */}
              <div className="space-y-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addingToCart}
                  className="w-full bg-gradient-to-r from-coral to-primary text-white py-4 px-8 rounded-full text-lg font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {addingToCart ? (
                    <>
                      <LoadingSpinner size="small" color="white" />
                      در حال افزودن...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      افزودن به سبد خرید
                    </>
                  )}
                </button>
                
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => navigate('/cart')}
                    className="bg-white border-2 border-coral text-coral py-3 px-6 rounded-full font-bold hover:bg-coral hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    سبد خرید
                  </button>
                  <button
                    onClick={handleToggleFavorite}
                    className={`py-3 px-6 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                      isFavorite
                        ? 'bg-red-50 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-coral hover:text-coral'
                    }`}
                  >
                    <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {isFavorite ? 'حذف از علاقه‌مندی' : 'علاقه‌مندی'}
                  </button>
                  <ShareButton product={product} />
                </div>
              </div>

              {/* اطلاعات اضافی */}
              <div className="bg-gradient-to-r from-pastel-green/20 to-pastel-pink/20 rounded-xl p-5 space-y-3">
                <div className="flex items-center text-gray-700">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center ml-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">ارسال رایگان بالای خرید ۵ میلیون تومان</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center ml-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="font-medium">ضمانت اصالت و کیفیت کالا</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center ml-3">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </div>
                  <span className="font-medium">امکان بازگشت کالا تا ۷ روز</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* تب‌های توضیحات و نظرات */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('description')}
                className={`flex-1 py-4 px-6 text-center font-bold transition-all ${
                  activeTab === 'description'
                    ? 'text-coral border-b-4 border-coral bg-coral/5'
                    : 'text-gray-600 hover:text-coral hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  توضیحات محصول
                </span>
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 py-4 px-6 text-center font-bold transition-all ${
                  activeTab === 'reviews'
                    ? 'text-coral border-b-4 border-coral bg-coral/5'
                    : 'text-gray-600 hover:text-coral hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  نظرات و دیدگاه‌ها
                </span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'description' ? (
              <div className="prose prose-lg max-w-none">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">توضیحات کامل محصول</h3>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>{product.description}</p>
                  
                  <div className="bg-gray-50 rounded-xl p-6 my-6">
                    <h4 className="font-bold text-gray-900 mb-3">ویژگی‌های محصول:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-coral ml-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>پارچه با کیفیت و نرم</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-coral ml-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>مناسب برای پوست حساس کودکان</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-coral ml-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>قابل شستشو در ماشین لباسشویی</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-coral ml-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>رنگ ثابت و ضد رنگ‌رفتگی</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-coral ml-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>طراحی شیک و مدرن</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-pastel-pink/20 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-3">راهنمای نگهداری:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• شستشو با آب سرد یا ولرم</li>
                      <li>• استفاده از مواد شوینده ملایم</li>
                      <li>• خشک کردن در سایه</li>
                      <li>• اتو در دمای متوسط</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <ProductReviews productId={id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
