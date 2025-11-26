// Export همه utility functions
export { default as dateUtils } from './dateUtils';
export { default as priceUtils } from './priceUtils';
export { default as numberUtils } from './numberUtils';
export { default as imageUtils } from './imageUtils';
export * from './errorUtils';

// توابع کمکی اضافی
export const utils = {
  // تولید ID یکتا
  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // تاخیر (برای async functions)
  delay: (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // throttle function
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // کپی متن در کلیپ‌بورد
  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // fallback برای مرورگرهای قدیمی
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  },

  // اعتبارسنجی ایمیل
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // اعتبارسنجی شماره موبایل ایران
  isValidMobile: (mobile) => {
    const mobileRegex = /^09\d{9}$/;
    return mobileRegex.test(mobile);
  },

  // اعتبارسنجی کد ملی ایران
  isValidNationalId: (nationalId) => {
    if (!nationalId || nationalId.length !== 10) return false;
    
    // بررسی اینکه همه ارقام یکسان نباشند
    if (/^(\d)\1{9}$/.test(nationalId)) return false;
    
    // محاسبه رقم کنترل
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(nationalId[i]) * (10 - i);
    }
    
    const remainder = sum % 11;
    const checkDigit = parseInt(nationalId[9]);
    
    return (remainder < 2 && checkDigit === remainder) || 
           (remainder >= 2 && checkDigit === 11 - remainder);
  },

  // تمیز کردن متن از HTML tags
  stripHtml: (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  },

  // کوتاه کردن متن
  truncateText: (text, maxLength, suffix = '...') => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + suffix;
  },

  // تبدیل اولین حرف به بزرگ
  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  // تبدیل به kebab-case
  toKebabCase: (str) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  },

  // تبدیل به camelCase
  toCamelCase: (str) => {
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
  },

  // بررسی خالی بودن object
  isEmpty: (obj) => {
    if (obj === null || obj === undefined) return true;
    if (Array.isArray(obj)) return obj.length === 0;
    if (typeof obj === 'object') return Object.keys(obj).length === 0;
    if (typeof obj === 'string') return obj.trim().length === 0;
    return false;
  },

  // deep clone object
  deepClone: (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => utils.deepClone(item));
    if (typeof obj === 'object') {
      const clonedObj = {};
      Object.keys(obj).forEach(key => {
        clonedObj[key] = utils.deepClone(obj[key]);
      });
      return clonedObj;
    }
  },

  // مقایسه عمیق دو object
  deepEqual: (obj1, obj2) => {
    if (obj1 === obj2) return true;
    
    if (obj1 == null || obj2 == null) return false;
    if (typeof obj1 !== typeof obj2) return false;
    
    if (typeof obj1 !== 'object') return obj1 === obj2;
    
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) return false;
    
    for (let key of keys1) {
      if (!keys2.includes(key)) return false;
      if (!utils.deepEqual(obj1[key], obj2[key])) return false;
    }
    
    return true;
  },

  // دریافت query parameters از URL
  getQueryParams: () => {
    const params = {};
    const searchParams = new URLSearchParams(window.location.search);
    
    for (let [key, value] of searchParams) {
      params[key] = value;
    }
    
    return params;
  },

  // تنظیم query parameter در URL
  setQueryParam: (key, value) => {
    const url = new URL(window.location);
    url.searchParams.set(key, value);
    window.history.pushState({}, '', url);
  },

  // حذف query parameter از URL
  removeQueryParam: (key) => {
    const url = new URL(window.location);
    url.searchParams.delete(key);
    window.history.pushState({}, '', url);
  },

  // scroll به بالای صفحه
  scrollToTop: (smooth = true) => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto'
    });
  },

  // scroll به element
  scrollToElement: (elementId, smooth = true) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  },

  // بررسی اینکه آیا در viewport است
  isInViewport: (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },
};