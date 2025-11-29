import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { LoadingSpinner, ErrorMessage, ProtectedRoute } from '../components';
import addressService from '../services/addressService';
import orderService from '../services/orderService';
import paymentService from '../services/paymentService';
import { priceUtils, imageUtils } from '../utils';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, totalPrice, getShippingCost, getFinalTotal, clearCart, shippingMethod } = useCart();
  
  const [address, setAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // دریافت آدرس انتخاب شده از state
  const selectedAddressId = location.state?.addressId;

  // تابع چاپ فاکتور
  const handlePrint = () => {
    window.print();
  };

  // تابع دانلود فاکتور به صورت PDF (ساده)
  const handleDownload = () => {
    // ایجاد محتوای HTML برای دانلود
    const invoiceContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <title>فاکتور خرید - پوکوپینی</title>
        <style>
          body { font-family: Tahoma, Arial, sans-serif; padding: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .section { margin-bottom: 20px; }
          .section-title { font-weight: bold; font-size: 16px; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
          th { background-color: #f2f2f2; }
          .total { font-size: 18px; font-weight: bold; text-align: left; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>فاکتور خرید</h1>
          <p>فروشگاه آنلاین پوکوپینی</p>
          <p>تاریخ: ${new Date().toLocaleDateString('fa-IR')}</p>
        </div>
        
        <div class="section">
          <div class="section-title">اطلاعات گیرنده</div>
          <p><strong>نام:</strong> ${address?.full_name || '-'}</p>
          <p><strong>شماره تماس:</strong> ${address?.phone_number || '-'}</p>
          <p><strong>آدرس:</strong> ${address?.province || ''} - ${address?.city || ''} - ${address?.address_line || ''}</p>
          <p><strong>کد پستی:</strong> ${address?.postal_code || '-'}</p>
        </div>
        
        <div class="section">
          <div class="section-title">محصولات</div>
          <table>
            <thead>
              <tr>
                <th>ردیف</th>
                <th>نام محصول</th>
                <th>تعداد</th>
                <th>قیمت واحد</th>
                <th>قیمت کل</th>
              </tr>
            </thead>
            <tbody>
              ${items.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.product?.name || '-'}</td>
                  <td>${item.quantity}</td>
                  <td>${priceUtils.formatPersianPrice(item.product?.price || 0)}</td>
                  <td>${priceUtils.formatPersianPrice((item.product?.price || 0) * item.quantity)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <table>
            <tr>
              <td><strong>قیمت کالاها:</strong></td>
              <td class="total">${priceUtils.formatPersianPrice(totalPrice)}</td>
            </tr>
            <tr>
              <td><strong>هزینه ارسال:</strong></td>
              <td class="total">${priceUtils.formatPersianPrice(getShippingCost())}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td><strong>مجموع قابل پرداخت:</strong></td>
              <td class="total" style="color: green; font-size: 20px;">${priceUtils.formatPersianPrice(getFinalTotal())}</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccc;">
          <p>با تشکر از خرید شما</p>
          <p>www.pokopini.com</p>
        </div>
      </body>
      </html>
    `;

    // ایجاد Blob و دانلود
    const blob = new Blob([invoiceContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    // اگر در حال پردازش پرداخت هستیم، از redirect جلوگیری کن
    if (isProcessingPayment) {
      return;
    }

    if (!selectedAddressId) {
      navigate('/checkout');
      return;
    }

    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    loadAddress();
  }, [selectedAddressId, items, navigate, isProcessingPayment]);

  const loadAddress = async () => {
    try {
      setIsLoading(true);
      const response = await addressService.getAddresses();
      const addressData = Array.isArray(response) ? response : (response.results || []);
      const selectedAddress = addressData.find(addr => addr.id.toString() === selectedAddressId);
      
      if (selectedAddress) {
        setAddress(selectedAddress);
      } else {
        setError('آدرس انتخاب شده یافت نشد');
        setTimeout(() => navigate('/checkout'), 2000);
      }
    } catch (err) {
      setError(err.message || 'خطا در بارگذاری آدرس');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setIsProcessingPayment(true);
    setError('');

    try {
      // ثبت سفارش
      const orderData = {
        address_id: parseInt(selectedAddressId),
        shipping_method: shippingMethod
      };

      console.log('Creating order with data:', orderData);
      const response = await orderService.createOrder(orderData);
      console.log('Order response:', response);
      
      const order = response.order || response;
      console.log('Order object:', order);
      
      if (!order || !order.id) {
        throw new Error('شماره سفارش دریافت نشد');
      }
      
      // ایجاد توکن پرداخت
      console.log('Creating payment token for order:', order.id);
      const paymentData = await paymentService.createPaymentToken(order.id);
      console.log('Payment data:', paymentData);
      
      if (!paymentData || !paymentData.payment_url) {
        throw new Error('URL درگاه پرداخت دریافت نشد');
      }
      
      // پاک کردن سبد خرید
      await clearCart();
      
      // هدایت به درگاه پرداخت
      console.log('Redirecting to:', paymentData.payment_url);
      
      // استفاده از setTimeout برای اطمینان از اینکه redirect اتفاق می‌افتد
      setTimeout(() => {
        window.location.href = paymentData.payment_url;
      }, 100);
      
    } catch (err) {
      console.error('Order Error:', err);
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'خطا در ثبت سفارش');
      setIsSubmitting(false);
      setIsProcessingPayment(false);
    }
  };

  const shippingCost = getShippingCost();
  const finalTotal = getFinalTotal();

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingSpinner size="large" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            تایید نهایی سفارش
          </h1>

          {error && (
            <ErrorMessage error={error} onClose={() => setError('')} className="mb-6" />
          )}

          {/* فاکتور سفارش */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6" id="invoice-content">
            {/* هدر فاکتور */}
            <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">فاکتور خرید</h2>
              <div className="flex gap-2 print:hidden">
                <button
                  onClick={handlePrint}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
                  title="چاپ فاکتور"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  چاپ
                </button>
                <button
                  onClick={handleDownload}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
                  title="دانلود فاکتور"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  دانلود
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* لیست محصولات */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  محصولات سفارش
                </h3>
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center space-x-4 space-x-reverse border-b border-gray-200 pb-4">
                      <img
                        src={imageUtils.getProductImageUrl(item.product)}
                        alt={item.product?.name}
                        className="w-20 h-20 object-cover rounded"
                        onError={imageUtils.handleImageError}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">
                          {item.product?.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          تعداد: {priceUtils.toPersianDigits(item.quantity)}
                        </div>
                        <div className="text-sm text-gray-600">
                          قیمت واحد: {priceUtils.formatPersianPrice(item.product?.price)}
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">
                          {priceUtils.formatPersianPrice(item.product?.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* آدرس تحویل */}
              {address && (
                <div className="mb-6 bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    آدرس تحویل
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="text-gray-600 w-32">گیرنده:</span>
                      <span className="text-gray-900 font-medium">{address.full_name}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-32">شماره تماس:</span>
                      <span className="text-gray-900">{address.phone_number}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-32">استان:</span>
                      <span className="text-gray-900">{address.province}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-32">شهر:</span>
                      <span className="text-gray-900">{address.city}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-32">کد پستی:</span>
                      <span className="text-gray-900">{address.postal_code}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-32">آدرس:</span>
                      <span className="text-gray-900">{address.address_line}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* جمع کل */}
              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">قیمت کالاها:</span>
                    <span className="text-gray-900">{priceUtils.formatPersianPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">هزینه ارسال ({shippingMethod === 'express' ? 'پست پیشتاز' : 'پست عادی'}):</span>
                    <span className="text-gray-900">
                      {priceUtils.formatPersianPrice(shippingCost)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-xl font-bold text-gray-900">مجموع قابل پرداخت:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {priceUtils.formatPersianPrice(finalTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* دکمه‌های عملیات */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/checkout')}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-400 transition-colors font-medium"
              disabled={isSubmitting}
            >
              بازگشت به صفحه قبل
            </button>
            <button
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="small" color="white" className="ml-2" />
                  {isProcessingPayment ? 'در حال انتقال به درگاه پرداخت...' : 'در حال ثبت سفارش...'}
                </div>
              ) : (
                'تایید نهایی سفارش'
              )}
            </button>
          </div>

          {/* توضیحات */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 ml-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">توجه:</p>
                <p>با کلیک روی دکمه "تایید نهایی سفارش"، سفارش شما ثبت و به درگاه پرداخت منتقل خواهید شد.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OrderConfirmation;
