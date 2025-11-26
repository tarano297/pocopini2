import { apiRequest } from './api';

const productService = {
  // دریافت لیست محصولات با فیلتر
  getProducts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // اضافه کردن فیلترها به query parameters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const queryString = params.toString();
      const url = queryString ? `/products/?${queryString}` : '/products/';
      
      const response = await apiRequest.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // دریافت جزئیات یک محصول
  getProductById: async (productId) => {
    try {
      const response = await apiRequest.get(`/products/${productId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // دریافت محصولات ویژه
  getFeaturedProducts: async () => {
    try {
      const response = await apiRequest.get('/products/featured/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // جستجو در محصولات
  searchProducts: async (searchTerm, filters = {}) => {
    try {
      const params = new URLSearchParams();
      params.append('search', searchTerm);
      
      // اضافه کردن فیلترهای اضافی
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const response = await apiRequest.get(`/products/?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // دریافت دسته‌بندی‌ها
  getCategories: () => {
    return [
      { value: 'baby', label: 'نوزاد' },
      { value: 'girl', label: 'دخترانه' },
      { value: 'boy', label: 'پسرانه' },
    ];
  },

  // دریافت فصل‌ها
  getSeasons: () => {
    return [
      { value: 'winter', label: 'زمستان' },
      { value: 'spring', label: 'بهار' },
      { value: 'summer', label: 'تابستان' },
      { value: 'fall', label: 'پاییز' },
    ];
  },

  // دریافت محصولات بر اساس دسته
  getProductsByCategory: async (category) => {
    try {
      const response = await apiRequest.get(`/products/?category=${category}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // دریافت محصولات بر اساس فصل
  getProductsBySeason: async (season) => {
    try {
      const response = await apiRequest.get(`/products/?season=${season}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // دریافت رنگ‌های موجود
  getAvailableColors: async () => {
    try {
      const response = await apiRequest.get('/products/colors/');
      return response.data;
    } catch (error) {
      // اگر API وجود نداشت، لیست پیش‌فرض برگردان
      return [
        'قرمز', 'آبی', 'سبز', 'زرد', 'صورتی', 'بنفش', 
        'نارنجی', 'سفید', 'مشکی', 'خاکستری', 'قهوه‌ای'
      ];
    }
  },

  // دریافت سایزهای موجود
  getAvailableSizes: async () => {
    try {
      const response = await apiRequest.get('/products/sizes/');
      return response.data;
    } catch (error) {
      // اگر API وجود نداشت، لیست پیش‌فرض برگردان
      return [
        'XS', 'S', 'M', 'L', 'XL', 'XXL',
        '0-3 ماه', '3-6 ماه', '6-9 ماه', '9-12 ماه',
        '1 سال', '2 سال', '3 سال', '4 سال', '5 سال'
      ];
    }
  },

  // دریافت محصولات مرتبط
  getRelatedProducts: async (productId) => {
    try {
      const response = await apiRequest.get(`/products/${productId}/related/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default productService;