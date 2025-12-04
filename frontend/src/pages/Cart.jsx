import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner, ErrorMessage } from '../components';
import { priceUtils, imageUtils } from '../utils';

const Cart = () => {
  const { 
    items, 
    totalPrice, 
    itemCount, 
    isLoading, 
    error, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    getShippingCost,
    getFinalTotal,
    shippingMethod 
  } = useCart();
  
  const { isAuthenticated } = useAuth();
  const [isUpdating, setIsUpdating] = useState({});

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setIsUpdating({ ...isUpdating, [itemId]: true });
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('خطا در به‌روزرسانی تعداد:', error);
    } finally {
      setIsUpdating({ ...isUpdating, [itemId]: false });
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('خطا در حذف محصول:', error);
    }
  };

  const shippingCost = getShippingCost();
  const finalTotal = getFinalTotal();

  // Debug: نمایش ساختار items
  React.useEffect(() => {
    if (items.length > 0) {
      console.log('Cart Items:', items);
      console.log('First Item:', items[0]);
      console.log('First Item Product:', items[0]?.product);
    }
  }, [items]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          سبد خرید ({priceUtils.toPersianDigits(itemCount)} کالا)
        </h1>

        {error && (
          <ErrorMessage error={error} className="mb-6" />
        )}

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0V19a2 2 0 002 2h7a2 2 0 002-2v-.5" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              سبد خرید شما خالی است
            </h2>
            <p className="text-gray-600 mb-6">
              برای خرید محصولات به صفحه محصولات بروید
            </p>
            <a
              href="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              مشاهده محصولات
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* لیست محصولات */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                      کالاهای شما
                    </h2>
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      خالی کردن سبد
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {items.map(item => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-start space-x-4 space-x-reverse">
                        {/* تصویر محصول */}
                        <div className="flex-shrink-0">
                          {item.product?.id ? (
                            <a href={`/product/${item.product.id}`} className="block">
                              <img
                                src={item.product?.image ? imageUtils.getProductImageUrl(item.product) : imageUtils.getPlaceholder()}
                                alt={item.product?.name || 'محصول'}
                                className="w-20 h-20 object-cover rounded-md bg-gray-100 hover:opacity-80 transition-opacity cursor-pointer"
                                onError={imageUtils.handleImageError}
                              />
                            </a>
                          ) : (
                            <img
                              src={item.product?.image ? imageUtils.getProductImageUrl(item.product) : imageUtils.getPlaceholder()}
                              alt={item.product?.name || 'محصول'}
                              className="w-20 h-20 object-cover rounded-md bg-gray-100"
                              onError={imageUtils.handleImageError}
                            />
                          )}
                        </div>

                        {/* اطلاعات محصول */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {item.product?.id ? (
                              <a href={`/product/${item.product.id}`} className="hover:text-coral transition-colors">
                                {item.product?.name || 'محصول'}
                              </a>
                            ) : (
                              <span>{item.product?.name || 'محصول'}</span>
                            )}
                          </h3>
                          <div className="text-sm text-gray-600 space-y-1">
                            {item.product?.color && <p>رنگ: {item.product.color}</p>}
                            {item.product?.size && <p>سایز: {item.product.size}</p>}
                          </div>
                          <div className="mt-2">
                            <span className="text-lg font-semibold text-gray-900">
                              {priceUtils.formatPersianPrice(item.product?.price || 0)}
                            </span>
                          </div>
                        </div>

                        {/* کنترل تعداد */}
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={isUpdating[item.id] || item.quantity <= 1}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-medium">
                            {isUpdating[item.id] ? (
                              <LoadingSpinner size="small" />
                            ) : (
                              priceUtils.toPersianDigits(item.quantity)
                            )}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={isUpdating[item.id]}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>

                        {/* دکمه حذف */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* خلاصه سفارش */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  خلاصه سفارش
                </h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">قیمت کالاها:</span>
                    <span className="font-medium">
                      {priceUtils.formatPersianPrice(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">هزینه ارسال ({shippingMethod === 'express' ? 'پست پیشتاز' : 'پست عادی'}):</span>
                    <span className="font-medium">
                      {priceUtils.formatPersianPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    روش ارسال را در صفحه تسویه حساب انتخاب کنید
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">مجموع:</span>
                    <span className="text-lg font-bold text-gray-900">
                      {priceUtils.formatPersianPrice(finalTotal)}
                    </span>
                  </div>
                </div>

                {isAuthenticated ? (
                  <a
                    href="/checkout"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors text-center block font-medium"
                  >
                    تکمیل خرید
                  </a>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 text-center">
                      برای تکمیل خرید وارد شوید
                    </p>
                    <a
                      href="/login?redirect=/checkout"
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors text-center block font-medium"
                    >
                      ورود و تکمیل خرید
                    </a>
                  </div>
                )}

                <div className="mt-4 text-center">
                  <a
                    href="/products"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    ← بازگشت به فروشگاه
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;