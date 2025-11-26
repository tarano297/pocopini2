import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner, ErrorMessage, ProtectedRoute, Toast } from '../components';
import addressService from '../services/addressService';
import orderService from '../services/orderService';
import { priceUtils, dateUtils, numberUtils } from '../utils';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: ''
  });
  
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
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'addresses') {
      loadAddresses();
    } else if (activeTab === 'orders') {
      loadOrders();
    }
  }, [activeTab]);

  const loadAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await addressService.getAddresses();
      const data = Array.isArray(response) ? response : (response.results || []);
      setAddresses(data);
    } catch (err) {
      setError(err.message || 'خطا در بارگذاری آدرس‌ها');
    } finally {
      setIsLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getOrders();
      setOrders(data.results || data);
    } catch (err) {
      setError(err.message || 'خطا در بارگذاری سفارشات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');
      await updateProfile(formData);
      setIsEditing(false);
      setSuccess('اطلاعات پروفایل با موفقیت به‌روزرسانی شد');
    } catch (err) {
      setError(err.message || 'خطا در به‌روزرسانی پروفایل');
    } finally {
      setIsLoading(false);
    }
  };

  // Address handlers
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
      setIsLoading(true);
      setError('');
      await addressService.deleteAddress(addressId);
      setSuccess('آدرس با موفقیت حذف شد');
      await loadAddresses();
    } catch (err) {
      setError(err.message || 'خطا در حذف آدرس');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      setIsLoading(true);
      setError('');
      await addressService.setDefaultAddress(addressId);
      setSuccess('آدرس پیش‌فرض با موفقیت تنظیم شد');
      await loadAddresses();
    } catch (err) {
      setError(err.message || 'خطا در تنظیم آدرس پیش‌فرض');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
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
      setIsLoading(true);
      setError('');
      
      if (editingAddress) {
        await addressService.updateAddress(editingAddress.id, addressFormData);
        setSuccess('آدرس با موفقیت ویرایش شد');
      } else {
        await addressService.createAddress(addressFormData);
        setSuccess('آدرس با موفقیت اضافه شد');
      }
      
      setShowAddressModal(false);
      await loadAddresses();
    } catch (err) {
      setError(err.message || 'خطا در ذخیره آدرس');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'اطلاعات کاربری', icon: 'user' },
    { id: 'addresses', name: 'آدرس‌ها', icon: 'location' },
    { id: 'orders', name: 'سفارشات', icon: 'shopping-bag' }
  ];

  const getTabIcon = (iconName) => {
    const icons = {
      user: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      location: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      'shopping-bag': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
        </svg>
      )
    };
    return icons[iconName];
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">پروفایل کاربری</h1>

          {error && (
            <ErrorMessage error={error} onClose={() => setError('')} className="mb-6" />
          )}
          
          {success && (
            <div className="fixed top-4 left-4 z-50">
              <Toast 
                id={Date.now()} 
                message={success} 
                type="success" 
                onClose={() => setSuccess('')}
                duration={3000}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg font-medium">
                        {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'ک'}
                      </span>
                    </div>
                    <div className="mr-3">
                      <div className="font-medium text-gray-900">
                        {user?.first_name && user?.last_name 
                          ? `${user.first_name} ${user.last_name}`
                          : user?.username
                        }
                      </div>
                      <div className="text-sm text-gray-600">{user?.email}</div>
                    </div>
                  </div>
                </div>
                <nav className="p-2">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      {getTabIcon(tab.icon)}
                      <span className="mr-3">{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md">
                {/* Addresses Tab */}
                {activeTab === 'addresses' && (
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">آدرس‌های من</h2>
                      <button
                        onClick={handleAddAddress}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center"
                      >
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        افزودن آدرس جدید
                      </button>
                    </div>

                    {isLoading ? (
                      <div className="flex justify-center py-8">
                        <LoadingSpinner size="medium" />
                      </div>
                    ) : addresses.length > 0 ? (
                      <div className="space-y-4">
                        {addresses.map(address => (
                          <div key={address.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <h3 className="font-medium text-gray-900">{address.full_name}</h3>
                                  {address.is_default && (
                                    <span className="mr-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                      پیش‌فرض
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-1">
                                  {numberUtils.toPersianDigits(address.phone_number)}
                                </p>
                                <p className="text-sm text-gray-700">
                                  {addressService.formatFullAddress(address)}
                                </p>
                              </div>
                              <div className="flex flex-col space-y-2">
                                <a
                                  href={`/checkout?address=${address.id}`}
                                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                                >
                                  انتخاب و ادامه خرید
                                </a>
                                <button 
                                  onClick={() => handleEditAddress(address)}
                                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                  ویرایش
                                </button>
                                {!address.is_default && (
                                  <button 
                                    onClick={() => handleSetDefaultAddress(address.id)}
                                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                                  >
                                    تنظیم پیش‌فرض
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleDeleteAddress(address.id)}
                                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                                >
                                  حذف
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-gray-500 mb-4">آدرسی ثبت نشده است</p>
                        <button
                          onClick={handleAddAddress}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          افزودن اولین آدرس
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">سفارشات من</h2>

                    {isLoading ? (
                      <div className="flex justify-center py-8">
                        <LoadingSpinner size="medium" />
                      </div>
                    ) : orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map(order => (
                          <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <div className="flex items-center mb-1">
                                  <h3 className="font-medium text-gray-900">
                                    سفارش #{numberUtils.toPersianDigits(order.id)}
                                  </h3>
                                  <span className={`mr-2 px-2 py-1 text-xs rounded-full ${
                                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {orderService.getStatusLabel(order.status)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {dateUtils.formatPersianDate(order.created_at)}
                                </p>
                              </div>
                              <div className="text-left">
                                <div className="font-semibold text-gray-900">
                                  {priceUtils.formatPersianPrice(order.total_price)}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {numberUtils.toPersianDigits(order.items?.length || 0)} کالا
                                </div>
                              </div>
                            </div>
                            
                            {order.items && order.items.length > 0 && (
                              <div className="border-t border-gray-100 pt-3 mt-3">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">محصولات:</h4>
                                <div className="space-y-2">
                                  {order.items.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-3 space-x-reverse">
                                      <img
                                        src={item.product?.image || '/placeholder-product.jpg'}
                                        alt={item.product?.name}
                                        className="w-12 h-12 object-cover rounded"
                                      />
                                      <div className="flex-1">
                                        <p className="text-sm text-gray-900">{item.product?.name}</p>
                                        <p className="text-xs text-gray-600">
                                          تعداد: {numberUtils.toPersianDigits(item.quantity)} × {priceUtils.formatPersianPrice(item.price)}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {order.address && (
                              <div className="border-t border-gray-100 pt-3 mt-3">
                                <h4 className="text-sm font-medium text-gray-700 mb-1">آدرس تحویل:</h4>
                                <p className="text-sm text-gray-600">
                                  {order.address.full_name} - {numberUtils.toPersianDigits(order.address.phone_number)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {addressService.formatFullAddress(order.address)}
                                </p>
                              </div>
                            )}
                            
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                              <a
                                href={`/orders/${order.id}`}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                              >
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                مشاهده جزئیات
                              </a>
                              {order.status === 'delivered' && (
                                <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                                  ثبت نظر
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                        </svg>
                        <p className="text-gray-500 mb-4">هنوز سفارشی ثبت نکرده‌اید</p>
                        <a
                          href="/products"
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          شروع خرید
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">اطلاعات کاربری</h2>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        {isEditing ? 'لغو' : 'ویرایش'}
                      </button>
                    </div>

                    {isEditing ? (
                      <form onSubmit={handleProfileUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              نام
                            </label>
                            <input
                              type="text"
                              value={formData.first_name}
                              onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              نام خانوادگی
                            </label>
                            <input
                              type="text"
                              value={formData.last_name}
                              onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ایمیل
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            شماره موبایل
                          </label>
                          <input
                            type="tel"
                            value={formData.phone_number}
                            onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="flex space-x-4 space-x-reverse">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                          >
                            {isLoading ? <LoadingSpinner size="small" color="white" /> : 'ذخیره تغییرات'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                          >
                            لغو
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">نام</label>
                            <div className="text-gray-900">{user?.first_name || '-'}</div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">نام خانوادگی</label>
                            <div className="text-gray-900">{user?.last_name || '-'}</div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">نام کاربری</label>
                          <div className="text-gray-900">{user?.username}</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">ایمیل</label>
                          <div className="text-gray-900">{user?.email}</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">شماره موبایل</label>
                          <div className="text-gray-900">{user?.phone_number || '-'}</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">تاریخ عضویت</label>
                          <div className="text-gray-900">{dateUtils.formatPersianDate(user?.date_joined)}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
                      id="is_default"
                      checked={addressFormData.is_default}
                      onChange={(e) => setAddressFormData({...addressFormData, is_default: e.target.checked})}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="is_default" className="mr-2 text-sm text-gray-700">
                      تنظیم به عنوان آدرس پیش‌فرض
                    </label>
                  </div>

                  <div className="flex space-x-4 space-x-reverse pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? <LoadingSpinner size="small" color="white" /> : editingAddress ? 'ذخیره تغییرات' : 'افزودن آدرس'}
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

export default Profile;