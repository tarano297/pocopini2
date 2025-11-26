import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';
import { LoadingSpinner, ErrorMessage } from '../components';
import ProductReviews from '../components/ProductReviews';
import { priceUtils, imageUtils } from '../utils';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:text-blue-700 flex items-center"
        >
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          بازگشت
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* تصویر محصول */}
            <div className="flex items-center justify-center">
              <img
                src={imageUtils.getProductImageUrl(product)}
                alt={product.name}
                className="w-full h-auto max-h-96 object-contain rounded-lg"
                onError={imageUtils.handleImageError}
              />
            </div>

            {/* اطلاعات محصول */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-gray-600">
                  {product.description}
                </p>
              </div>

              <div className="border-t border-b border-gray-200 py-4">
                <div className="text-3xl font-bold text-gray-900">
                  {priceUtils.formatPersianPrice(product.price)}
                </div>
                {product.stock > 0 ? (
                  <p className="text-green-600 mt-2">موجود در انبار</p>
                ) : (
                  <p className="text-red-600 mt-2">ناموجود</p>
                )}
              </div>

              {/* انتخاب سایز */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  سایز
                </label>
                <div className="flex gap-2">
                  {['S', 'M', 'L', 'XL'].map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md ${
                        selectedSize === size
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* انتخاب رنگ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رنگ
                </label>
                <div className="flex gap-2">
                  {['مشکی', 'سفید', 'آبی', 'قرمز', 'سبز'].map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-md ${
                        selectedColor === color
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* انتخاب تعداد */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تعداد
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">
                    {priceUtils.toPersianDigits(quantity)}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* دکمه‌های اقدام */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addingToCart}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {addingToCart ? (
                    <>
                      <LoadingSpinner size="small" color="white" className="ml-2" />
                      در حال افزودن...
                    </>
                  ) : (
                    'افزودن به سبد خرید'
                  )}
                </button>
                
                <button
                  onClick={() => navigate('/cart')}
                  className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300 transition-colors"
                >
                  مشاهده سبد خرید
                </button>
              </div>

              {/* اطلاعات اضافی */}
              <div className="border-t border-gray-200 pt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <svg className="w-5 h-5 ml-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  ارسال رایگان برای خریدهای بالای ۵۰۰,۰۰۰ تومان
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 ml-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  ضمانت اصالت کالا
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 ml-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  امکان بازگشت کالا تا ۷ روز
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* بخش نظرات */}
        <ProductReviews productId={id} />
      </div>
    </div>
  );
};

export default ProductDetail;
