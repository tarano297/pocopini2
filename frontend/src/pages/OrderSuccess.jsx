import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingSpinner, ErrorMessage, ProtectedRoute } from '../components';
import orderService from '../services/orderService';
import { priceUtils, imageUtils } from '../utils';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setIsLoading(true);
      const orderData = await orderService.getOrderById(orderId);
      setOrder(orderData);
    } catch (err) {
      setError(err.message || 'خطا در بارگذاری اطلاعات سفارش');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingSpinner size="large" />
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <ErrorMessage error={error} />
            <button
              onClick={() => navigate('/profile')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              بازگشت به پروفایل
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* پیام موفقیت */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="bg-green-600 text-white px-6 py-8 text-center">
              <div className="flex justify-center mb-4">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-2">سفارش شما با موفقیت ثبت شد!</h1>
              <p className="text-green-100">
                شماره سفارش: {priceUtils.toPersianDigits(order?.id || orderId)}
              </p>
            </div>

            <div className="p-6">
              {order && (
                <>
                  {/* اطلاعات سفارش */}
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      جزئیات سفارش
                    </h2>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">وضعیت:</span>
                        <span className={`font-medium ${
                          order.status === 'pending' ? 'text-yellow-600' :
                          order.status === 'processing' ? 'text-blue-600' :
                          order.status === 'shipped' ? 'text-purple-600' :
                          order.status === 'delivered' ? 'text-green-600' :
                          'text-red-600'
                        }`}>
                          {orderService.getStatusLabel(order.status)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">تاریخ ثبت:</span>
                        <span className="text-gray-900">
                          {new Date(order.created_at).toLocaleDateString('fa-IR')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">مبلغ کل:</span>
                        <span className="text-gray-900 font-semibold">
                          {priceUtils.formatPersianPrice(order.total_price)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* محصولات */}
                  {order.items && order.items.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        محصولات سفارش
                      </h2>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3 space-x-reverse border-b border-gray-200 pb-3">
                            {item.product?.image && (
                              <img
                                src={imageUtils.getProductImageUrl(item.product)}
                                alt={item.product?.name}
                                className="w-16 h-16 object-cover rounded"
                                onError={imageUtils.handleImageError}
                              />
                            )}
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {item.product?.name || 'محصول'}
                              </div>
                              {item.product?.product_code && (
                                <div className="text-xs text-gray-500">
                                  کد محصول: {item.product.product_code}
                                </div>
                              )}
                              <div className="text-sm text-gray-600">
                                تعداد: {priceUtils.toPersianDigits(item.quantity)} × {priceUtils.formatPersianPrice(item.price)}
                              </div>
                            </div>
                            <div className="font-semibold text-gray-900">
                              {priceUtils.formatPersianPrice(item.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* آدرس تحویل */}
                  {order.address && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">
                        آدرس تحویل
                      </h2>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-900">
                          <span className="font-medium">گیرنده:</span> {order.address.full_name}
                        </p>
                        <p className="text-gray-900">
                          <span className="font-medium">تلفن:</span> {order.address.phone_number}
                        </p>
                        <p className="text-gray-700">
                          {order.address.province}، {order.address.city}
                        </p>
                        <p className="text-gray-700">
                          {order.address.address_line}
                        </p>
                        <p className="text-gray-700">
                          کد پستی: {order.address.postal_code}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* دکمه‌های عملیات */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/products')}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              ادامه خرید
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-400 transition-colors font-medium"
            >
              مشاهده سفارشات من
            </button>
          </div>

          {/* اطلاعیه */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 ml-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">توجه:</p>
                <p>سفارش شما در حال پردازش است و به زودی برای ارسال آماده خواهد شد. می‌توانید وضعیت سفارش خود را از بخش پروفایل پیگیری کنید.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OrderSuccess;
