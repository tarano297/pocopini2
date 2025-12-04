// توابع کمکی برای مدیریت تصاویر

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const imageUtils = {
  // دریافت URL کامل تصویر
  getImageUrl: (imagePath) => {
    if (!imagePath) return '/placeholder-product.svg';
    
    // اگر URL کامل است، همان را برگردان
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // اگر با / شروع می‌شود، از root سرور استفاده کن
    if (imagePath.startsWith('/')) {
      return `${API_BASE_URL}${imagePath}`;
    }
    
    // در غیر این صورت، به media اضافه کن
    return `${API_BASE_URL}/media/${imagePath}`;
  },

  // دریافت URL تصویر محصول
  getProductImageUrl: (product) => {
    return imageUtils.getImageUrl(product?.image);
  },

  // placeholder برای تصاویر
  getPlaceholder: () => {
    return '/placeholder-product.svg';
  },

  // handler برای خطای بارگذاری تصویر
  handleImageError: (e) => {
    e.target.onerror = null; // جلوگیری از loop بی‌نهایت
    e.target.src = imageUtils.getPlaceholder();
  },
};

export default imageUtils;
