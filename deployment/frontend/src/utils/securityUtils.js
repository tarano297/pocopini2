/**
 * Security Utilities for Frontend
 * توابع امنیتی برای فرانت‌اند
 */

/**
 * Sanitize HTML to prevent XSS attacks
 * پاکسازی HTML برای جلوگیری از حملات XSS
 */
export const sanitizeHTML = (html) => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

/**
 * Escape special characters
 * فرار از کاراکترهای خاص
 */
export const escapeHTML = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return text.replace(/[&<>"'/]/g, (char) => map[char]);
};

/**
 * Validate Iranian phone number
 * اعتبارسنجی شماره تلفن ایرانی
 */
export const validateIranianPhone = (phone) => {
  const mobilePattern = /^09\d{9}$/;
  const landlinePattern = /^0\d{2,3}\d{8}$/;
  return mobilePattern.test(phone) || landlinePattern.test(phone);
};

/**
 * Validate Iranian postal code
 * اعتبارسنجی کد پستی ایرانی
 */
export const validatePostalCode = (postalCode) => {
  return /^\d{10}$/.test(postalCode);
};

/**
 * Validate Iranian national code
 * اعتبارسنجی کد ملی ایرانی
 */
export const validateNationalCode = (code) => {
  if (!/^\d{10}$/.test(code)) return false;
  
  const check = parseInt(code[9]);
  const sum = code
    .split('')
    .slice(0, 9)
    .reduce((acc, digit, index) => acc + parseInt(digit) * (10 - index), 0);
  const remainder = sum % 11;
  
  return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
};

/**
 * Validate email format
 * اعتبارسنجی فرمت ایمیل
 */
export const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

/**
 * Validate strong password
 * اعتبارسنجی رمز عبور قوی
 */
export const validateStrongPassword = (password) => {
  const minLength = 10;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    errors: {
      length: password.length < minLength,
      uppercase: !hasUpperCase,
      lowercase: !hasLowerCase,
      number: !hasNumbers,
      special: !hasSpecialChar,
    },
  };
};

/**
 * Check for SQL injection patterns
 * بررسی الگوهای SQL Injection
 */
export const hasSQLInjection = (input) => {
  const sqlPatterns = [
    /union\s+select/i,
    /drop\s+table/i,
    /insert\s+into/i,
    /delete\s+from/i,
    /update\s+\w+\s+set/i,
    /exec\s*\(/i,
    /execute\s*\(/i,
    /--/,
    /\/\*/,
    /\*\//,
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

/**
 * Check for XSS patterns
 * بررسی الگوهای XSS
 */
export const hasXSS = (input) => {
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /onerror\s*=/i,
    /onload\s*=/i,
    /onclick\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /eval\s*\(/i,
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
};

/**
 * Validate input for dangerous patterns
 * اعتبارسنجی ورودی برای الگوهای خطرناک
 */
export const validateInput = (input) => {
  if (hasSQLInjection(input)) {
    return { isValid: false, error: 'ورودی نامعتبر است' };
  }
  
  if (hasXSS(input)) {
    return { isValid: false, error: 'ورودی نامعتبر است' };
  }
  
  return { isValid: true };
};

/**
 * Secure localStorage with encryption
 * ذخیره امن در localStorage با رمزنگاری
 */
export const secureStorage = {
  setItem: (key, value) => {
    try {
      const encrypted = btoa(JSON.stringify(value));
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  
  getItem: (key) => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      return JSON.parse(atob(encrypted));
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  removeItem: (key) => {
    localStorage.removeItem(key);
  },
  
  clear: () => {
    localStorage.clear();
  },
};

/**
 * Generate CSRF token
 * تولید توکن CSRF
 */
export const generateCSRFToken = () => {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Validate file upload
 * اعتبارسنجی آپلود فایل
 */
export const validateFileUpload = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  } = options;
  
  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `حجم فایل نباید بیشتر از ${maxSize / (1024 * 1024)} مگابایت باشد`,
    };
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'فرمت فایل مجاز نیست',
    };
  }
  
  // Check file extension
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    return {
      isValid: false,
      error: 'پسوند فایل مجاز نیست',
    };
  }
  
  return { isValid: true };
};

/**
 * Debounce function for rate limiting
 * تابع Debounce برای محدودیت نرخ
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for rate limiting
 * تابع Throttle برای محدودیت نرخ
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Check if token is expired
 * بررسی انقضای توکن
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= exp;
  } catch (error) {
    return true;
  }
};

/**
 * Secure redirect
 * هدایت امن
 */
export const secureRedirect = (url) => {
  // Only allow relative URLs or same origin
  if (url.startsWith('/') || url.startsWith(window.location.origin)) {
    window.location.href = url;
  } else {
    console.error('Invalid redirect URL');
  }
};

/**
 * Content Security Policy helper
 * کمک‌کننده Content Security Policy
 */
export const setupCSP = () => {
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
  document.head.appendChild(meta);
};

/**
 * Remove sensitive data from error messages
 * حذف اطلاعات حساس از پیام‌های خطا
 */
export const sanitizeError = (error) => {
  // Don't expose sensitive information in production
  if (process.env.NODE_ENV === 'production') {
    return 'خطایی رخ داده است. لطفاً دوباره تلاش کنید.';
  }
  return error.message || 'خطای نامشخص';
};

export default {
  sanitizeHTML,
  escapeHTML,
  validateIranianPhone,
  validatePostalCode,
  validateNationalCode,
  validateEmail,
  validateStrongPassword,
  hasSQLInjection,
  hasXSS,
  validateInput,
  secureStorage,
  generateCSRFToken,
  validateFileUpload,
  debounce,
  throttle,
  isTokenExpired,
  secureRedirect,
  setupCSP,
  sanitizeError,
};
