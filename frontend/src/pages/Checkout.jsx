import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner, ErrorMessage, ProtectedRoute } from '../components';
import addressService from '../services/addressService';
import { priceUtils, imageUtils } from '../utils';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, getShippingCost, getFinalTotal, shippingMethod, setShippingMethod } = useCart();
  const { user } = useAuth();
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Address modal states
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressFormData, setAddressFormData] = useState({
    full_name: '',
    phone_number: '',
    province: '',
    city: '',
    postal_code: '',
    address_line: '',
    is_default: false
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await addressService.getAddresses();
      const addressData = Array.isArray(response) ? response : (response.results || []);
      setAddresses(addressData);
      
      // چک کردن آدرس از URL
      const urlParams = new URLSearchParams(window.location.search);
      const addressFromUrl = urlParams.get('address');
      
      if (addressFromUrl && addressData.find(addr => addr.id.toString() === addressFromUrl)) {
        setSelectedAddress(addressFromUrl);
      } else {
        // انتخاب آدرس پیش‌فرض
        const defaultAddress = addressData.find(addr => addr.is_default);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress.id.toString());
        }
      }
    } catch (err) {
      setError(err.message || 'خطا در بارگذاری آدرس‌ها');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToConfirmation = () => {
    if (!selectedAddress) {
      setError('لطفاً آدرس تحویل را انتخاب کنید');
      return;
    }

    if (!items || items.length === 0) {
      setError('سبد خرید شما خالی است');
      return;
    }

    // هدایت به صفحه تایید نهایی
    navigate('/order-confirmation', { 
      state: { addressId: selectedAddress }
    });
  };

  // Address management handlers
  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressFormData({
      full_name: '',
      phone_number: '',
      province: '',
      city: '',
      postal_code: '',
      address_line: '',
      is_default: false
    });
    setShowAddressModal(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressFormData({
      full_name: address.full_name,
      phone_number: address.phone_number,
      province: address.province,
      city: address.city,
      postal_code: address.postal_code,
      address_line: address.address_line,
      is_default: address.is_default
    });
    setShowAddressModal(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('آیا از حذف این آدرس اطمینان دارید؟')) {
      return;
    }

    try {
      setError('');
      await addressService.deleteAddress(addressId);
      setSuccess('آدرس با موفقیت حذف شد');
      await loadAddresses();
      
      // اگر آدرس انتخاب شده حذف شد، انتخاب را پاک کن
      if (selectedAddress === addressId.toString()) {
        setSelectedAddress('');
      }
    } catch (err) {
      setError(err.message || 'خطا در حذف آدرس');
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    if (!addressFormData.full_name || !addressFormData.phone_number || 
        !addressFormData.province || !addressFormData.city || 
        !addressFormData.postal_code || !addressFormData.address_line) {
      setError('لطفاً تمام فیلدها را پر کنید');
      return;
    }

    if (!addressService.validatePostalCode(addressFormData.postal_code)) {
      setError('کد پستی باید ۱۰ رقم باشد');
      return;
    }

    if (!addressService.validatePhoneNumber(addressFormData.phone_number)) {
      setError('شماره تلفن معتبر نیست');
      return;
    }

    try {
      setError('');
      
      if (editingAddress) {
        await addressService.updateAddress(editingAddress.id, addressFormData);
        setSuccess('آدرس با موفقیت ویرایش شد');
      } else {
        const newAddress = await addressService.createAddress(addressFormData);
        setSuccess('آدرس با موفقیت اضافه شد');
        setSelectedAddress(newAddress.id.toString());
      }
      
      setShowAddressModal(false);
      await loadAddresses();
    } catch (err) {
      setError(err.message || 'خطا در ذخیره آدرس');
    }
  };

  const shippingCost = getShippingCost();
  const finalTotal = getFinalTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">سبد خرید خالی است</h2>
          <p className="text-gray-600 mb-4">برای ثبت سفارش ابتدا محصولی به سبد اضافه کنید</p>
          <a href="/products" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            مشاهده محصولات
          </a>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">تکمیل خرید</h1>

          {error && (
            <ErrorMessage error={error} onClose={() => setError('')} className="mb-6" />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* فرم سفارش */}
            <div className="lg:col-span-2 space-y-6">
              {/* انتخاب آدرس */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    آدرس تحویل
                  </h2>
                  <button
                    onClick={handleAddAddress}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                  >
                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    افزودن آدرس جدید
                  </button>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <LoadingSpinner size="medium" />
                  </div>
                ) : addresses.length > 0 ? (
                  <div className="space-y-3">
                    {addresses.map(address => (
                      <div
                        key={address.id}
                        className={`p-4 border rounded-lg transition-colors ${
                          selectedAddress === address.id.toString()
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300'
                        }`}
                      >
                        <label className="cursor-pointer flex items-start">
                          <input
                            type="radio"
                            name="address"
                            value={address.id}
                            checked={selectedAddress === address.id.toString()}
                            onChange={(e) => setSelectedAddress(e.target.value)}
                            className="mt-1 ml-3 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-gray-900 mb-1">
                                  {address.full_name}
                                  {address.is_default && (
                                    <span className="mr-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                      پیش‌فرض
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                  {address.phone_number}
                                </div>
                                <div className="text-sm text-gray-700">
                                  {addressService.formatFullAddress(address)}
                                </div>
                              </div>
                              <div className="flex space-x-2 space-x-reverse">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleEditAddress(address);
                                  }}
                                  className="text-blue-600 hover:text-blue-700 p-1"
                                  title="ویرایش"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteAddress(address.id);
                                  }}
                                  className="text-red-600 hover:text-red-700 p-1"
                                  title="حذف"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-600 mb-4">آدرسی ثبت نشده است</p>
                    <button
                      onClick={handleAddAddress}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      افزودن اولین آدرس
                    </button>
                  </div>
                )}
              </div>

              {/* روش ارسال */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  روش ارسال
                </h2>
                <div className="space-y-3">
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    shippingMethod === 'standard' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={shippingMethod === 'standard'}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="ml-3 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-gray-900">پست عادی</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {priceUtils.formatPersianPrice(30000)}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        ارسال طی 5 تا 7 روز کاری
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    shippingMethod === 'express' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={shippingMethod === 'express'}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="ml-3 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-gray-900">پست پیشتاز</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {priceUtils.formatPersianPrice(50000)}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        ارسال طی 2 تا 3 روز کاری
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* اطلاعات پرداخت */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  روش پرداخت
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-blue-500 bg-blue-50 rounded-lg">
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      defaultChecked
                      className="ml-3 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">پرداخت آنلاین</div>
                      <div className="text-sm text-gray-600">
                        پرداخت امن با کارت‌های بانکی
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* خلاصه سفارش */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  خلاصه سفارش
                </h2>

                {/* لیست محصولات */}
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center space-x-3 space-x-reverse">
                      <img
                        src={imageUtils.getProductImageUrl(item.product)}
                        alt={item.product?.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={imageUtils.handleImageError}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {item.product?.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {priceUtils.toPersianDigits(item.quantity)} × {priceUtils.formatPersianPrice(item.product?.price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">قیمت کالاها:</span>
                    <span>{priceUtils.formatPersianPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">هزینه ارسال:</span>
                    <span>
                      {shippingCost === 0 ? 'رایگان' : priceUtils.formatPersianPrice(shippingCost)}
                    </span>
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

                <button
                  onClick={handleProceedToConfirmation}
                  disabled={!selectedAddress}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  تایید و پرداخت
                </button>

                <div className="mt-4 text-center">
                  <a
                    href="/cart"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    ← بازگشت به سبد خرید
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Modal */}
        {showAddressModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {editingAddress ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}
                  </h3>
                  <button
                    onClick={() => setShowAddressModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نام و نام خانوادگی <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={addressFormData.full_name}
                        onChange={(e) => setAddressFormData({...addressFormData, full_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        شماره تلفن <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={addressFormData.phone_number}
                        onChange={(e) => setAddressFormData({...addressFormData, phone_number: e.target.value})}
                        placeholder="09123456789"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        استان <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={addressFormData.province}
                        onChange={(e) => setAddressFormData({...addressFormData, province: e.target.value, city: ''})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">انتخاب استان</option>
                        {addressService.getProvinces().map(province => (
                          <option key={province} value={province}>{province}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        شهر <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={addressFormData.city}
                        onChange={(e) => setAddressFormData({...addressFormData, city: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      کد پستی <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressFormData.postal_code}
                      onChange={(e) => setAddressFormData({...addressFormData, postal_code: e.target.value})}
                      placeholder="1234567890"
                      maxLength="10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">کد پستی باید ۱۰ رقم باشد</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      آدرس کامل <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={addressFormData.address_line}
                      onChange={(e) => setAddressFormData({...addressFormData, address_line: e.target.value})}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_default_checkout"
                      checked={addressFormData.is_default}
                      onChange={(e) => setAddressFormData({...addressFormData, is_default: e.target.checked})}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="is_default_checkout" className="mr-2 text-sm text-gray-700">
                      تنظیم به عنوان آدرس پیش‌فرض
                    </label>
                  </div>

                  <div className="flex space-x-4 space-x-reverse pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      {editingAddress ? 'ذخیره تغییرات' : 'افزودن آدرس'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(false)}
                      className="flex-1 bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      لغو
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Checkout;