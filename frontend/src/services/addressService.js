import { apiRequest } from './api';

const addressService = {
  // دریافت لیست آدرس‌های کاربر
  getAddresses: async () => {
    try {
      const response = await apiRequest.get('/auth/addresses/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ایجاد آدرس جدید
  createAddress: async (addressData) => {
    try {
      const response = await apiRequest.post('/auth/addresses/', addressData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // دریافت جزئیات یک آدرس
  getAddressById: async (addressId) => {
    try {
      const response = await apiRequest.get(`/auth/addresses/${addressId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // به‌روزرسانی آدرس
  updateAddress: async (addressId, addressData) => {
    try {
      const response = await apiRequest.put(`/auth/addresses/${addressId}/`, addressData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // حذف آدرس
  deleteAddress: async (addressId) => {
    try {
      const response = await apiRequest.delete(`/auth/addresses/${addressId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // تنظیم آدرس به عنوان پیش‌فرض
  setDefaultAddress: async (addressId) => {
    try {
      const response = await apiRequest.post(`/auth/addresses/${addressId}/set-default/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // دریافت آدرس پیش‌فرض
  getDefaultAddress: async () => {
    try {
      const addresses = await addressService.getAddresses();
      return addresses.find(address => address.is_default) || null;
    } catch (error) {
      throw error;
    }
  },

  // اعتبارسنجی کد پستی
  validatePostalCode: (postalCode) => {
    // کد پستی ایران باید ۱۰ رقم باشد
    const postalCodeRegex = /^\d{10}$/;
    return postalCodeRegex.test(postalCode);
  },

  // اعتبارسنجی شماره تلفن
  validatePhoneNumber: (phoneNumber) => {
    // شماره موبایل ایران
    const mobileRegex = /^09\d{9}$/;
    // شماره ثابت تهران
    const landlineRegex = /^021\d{8}$/;
    
    return mobileRegex.test(phoneNumber) || landlineRegex.test(phoneNumber);
  },

  // فرمت آدرس کامل
  formatFullAddress: (address) => {
    if (!address) return '';
    
    const parts = [
      address.province,
      address.city,
      address.address_line,
      `کد پستی: ${address.postal_code}`
    ].filter(Boolean);
    
    return parts.join('، ');
  },

  // دریافت لیست استان‌ها
  getProvinces: () => {
    return [
      'تهران', 'اصفهان', 'فارس', 'خراسان رضوی', 'آذربایجان شرقی',
      'خوزستان', 'مازندران', 'کرمان', 'آذربایجان غربی', 'گیلان',
      'مرکزی', 'قم', 'قزوین', 'گلستان', 'کردستان', 'همدان',
      'یزد', 'لرستان', 'کرمانشاه', 'بوشهر', 'زنجان', 'سمنان',
      'ایلام', 'کهگیلویه و بویراحمد', 'چهارمحال و بختیاری', 'البرز',
      'خراسان شمالی', 'خراسان جنوبی', 'اردبیل', 'هرمزگان', 'سیستان و بلوچستان'
    ];
  },

  // دریافت شهرهای یک استان (نمونه برای تهران)
  getCitiesByProvince: (province) => {
    const cities = {
      'تهران': [
        'تهران', 'کرج', 'اسلامشهر', 'ورامین', 'رباط کریم', 'شهریار',
        'ملارد', 'قدس', 'پاکدشت', 'دماوند', 'فیروزکوه', 'شمیرانات'
      ],
      'اصفهان': [
        'اصفهان', 'کاشان', 'نجف‌آباد', 'خمینی‌شهر', 'شاهین‌شهر', 'فولادشهر',
        'مبارکه', 'تیران', 'گلپایگان', 'نطنز', 'اردستان'
      ],
      // می‌توان برای سایر استان‌ها نیز اضافه کرد
    };
    
    return cities[province] || [];
  },

  // جستجو در آدرس‌ها
  searchAddresses: (addresses, searchTerm) => {
    if (!searchTerm) return addresses;
    
    const term = searchTerm.toLowerCase();
    return addresses.filter(address => 
      address.full_name.toLowerCase().includes(term) ||
      address.city.toLowerCase().includes(term) ||
      address.province.toLowerCase().includes(term) ||
      address.address_line.toLowerCase().includes(term)
    );
  },

  // مرتب‌سازی آدرس‌ها
  sortAddresses: (addresses, sortBy = 'default_first') => {
    const sortedAddresses = [...addresses];
    
    switch (sortBy) {
      case 'default_first':
        return sortedAddresses.sort((a, b) => b.is_default - a.is_default);
      case 'name':
        return sortedAddresses.sort((a, b) => a.full_name.localeCompare(b.full_name));
      case 'city':
        return sortedAddresses.sort((a, b) => a.city.localeCompare(b.city));
      case 'newest':
        return sortedAddresses.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      default:
        return sortedAddresses;
    }
  },
};

export default addressService;