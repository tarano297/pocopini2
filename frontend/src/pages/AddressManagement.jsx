import React, { useState, useEffect } from 'react';
import { LoadingSpinner, ErrorMessage, ProtectedRoute, Toast } from '../components';
import addressService from '../services/addressService';
import { numberUtils } from '../utils';

const AddressManagement = () => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
      console.log('Loading addresses...');
      const data = await addressService.getAddresses();
      console.log('Addresses loaded:', data);
      // Backend returns paginated data with results array
      setAddresses(data.results || data);
    } catch (err) {
      console.error('Load addresses error:', err);
      setError(err.message || err.response?.data?.message || 'خطا در بارگذاری آدرس‌ها');
    } finally {
      setIsLoading(false);
    }
  };

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
      
      console.log('Sending address data:', addressFormData);
      
      if (editingAddress) {
        const result = await addressService.updateAddress(editingAddress.id, addressFormData);
        console.log('Update result:', result);
        setSuccess('آدرس با موفقیت ویرایش شد');
      } else {
        const result = await addressService.createAddress(addressFormData);
        console.log('Create result:', result);
        setSuccess('آدرس با موفقیت اضافه شد');
      }
      
      setShowAddressModal(false);
      await loadAddresses();
    } catch (err) {
      console.error('Address submit error:', err);
      setError(err.message || err.response?.data?.message || 'خطا در ذخیره آدرس');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <a href="/profile" className="text-blue-600 hover:text-blue-700 flex items-center mb-4">
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              بازگشت به پروفایل
            </a>
            <h1 className="text-3xl font-bold text-gray-900">مدیریت آدرس‌ها</h1>
          </div>

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

          <div className="bg-white rounded-lg shadow-md p-6">
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
                        <p className="text-sm text-gray-700 mb-2">
                          {addressService.formatFullAddress(address)}
                        </p>
                        <p className="text-xs text-gray-500">
                          کد پستی: {numberUtils.toPersianDigits(address.postal_code)}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-2">
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

export default AddressManagement;
