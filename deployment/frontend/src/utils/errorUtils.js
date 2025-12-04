// تبدیل خطاهای API به پیام‌های فارسی

/**
 * دریافت پیام خطا به زبان فارسی
 * @param {Object} error - شیء خطا
 * @returns {string} - پیام خطا به فارسی
 */
export const getErrorMessage = (error) => {
  // اگر پیام فارسی از سرور آمده
  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // اگر خطای اعتبارسنجی فیلدها وجود دارد
  if (error.response?.data?.details) {
    const details = error.response.data.details;
    const firstField = Object.keys(details)[0];
    if (firstField && Array.isArray(details[firstField])) {
      return details[firstField][0];
    }
  }

  // پیام‌های خطا بر اساس کد وضعیت HTTP
  const status = error.response?.status || error.status;

  switch (status) {
    case 0:
      return 'خطا در اتصال به اینترنت. لطفاً اتصال خود را بررسی کنید.';
    
    case 400:
      return 'اطلاعات ارسالی نامعتبر است. لطفاً دوباره تلاش کنید.';
    
    case 401:
      return 'لطفاً مجدداً وارد شوید.';
    
    case 403:
      return 'شما دسترسی لازم برای این عملیات را ندارید.';
    
    case 404:
      return 'صفحه یا منبع مورد نظر یافت نشد.';
    
    case 408:
      return 'زمان درخواست به پایان رسید. لطفاً دوباره تلاش کنید.';
    
    case 409:
      return 'این عملیات با اطلاعات موجود تداخل دارد.';
    
    case 422:
      return 'اطلاعات ارسالی قابل پردازش نیست.';
    
    case 429:
      return 'تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً کمی صبر کنید.';
    
    case 500:
      return 'خطا در سرور. لطفاً بعداً تلاش کنید.';
    
    case 502:
      return 'خطا در ارتباط با سرور. لطفاً بعداً تلاش کنید.';
    
    case 503:
      return 'سرویس در حال حاضر در دسترس نیست. لطفاً بعداً تلاش کنید.';
    
    case 504:
      return 'زمان اتصال به سرور به پایان رسید. لطفاً دوباره تلاش کنید.';
    
    default:
      if (status >= 500) {
        return 'خطا در سرور. لطفاً بعداً تلاش کنید.';
      }
      return error.message || 'خطایی رخ داد. لطفاً دوباره تلاش کنید.';
  }
};

/**
 * بررسی اینکه آیا خطا قابل retry است
 * @param {Object} error - شیء خطا
 * @returns {boolean}
 */
export const isRetryableError = (error) => {
  const status = error.response?.status || error.status;

  // خطاهای شبکه
  if (!status || status === 0) {
    return true;
  }

  // خطاهای سرور (5xx)
  if (status >= 500) {
    return true;
  }

  // خطای timeout
  if (error.code === 'ECONNABORTED') {
    return true;
  }

  // خطاهای موقت
  const retryableStatuses = [408, 429, 502, 503, 504];
  if (retryableStatuses.includes(status)) {
    return true;
  }

  return false;
};

/**
 * دریافت پیام‌های خطای اعتبارسنجی فیلدها
 * @param {Object} error - شیء خطا
 * @returns {Object} - آبجکت شامل خطاهای هر فیلد
 */
export const getFieldErrors = (error) => {
  if (error.response?.data?.details) {
    return error.response.data.details;
  }

  // برخی APIها خطاها را مستقیماً در data برمی‌گردانند
  if (error.response?.data && typeof error.response.data === 'object') {
    const fieldErrors = {};
    Object.keys(error.response.data).forEach(key => {
      if (Array.isArray(error.response.data[key])) {
        fieldErrors[key] = error.response.data[key];
      }
    });
    
    if (Object.keys(fieldErrors).length > 0) {
      return fieldErrors;
    }
  }

  return {};
};

/**
 * تبدیل نام فیلدهای انگلیسی به فارسی
 * @param {string} fieldName - نام فیلد به انگلیسی
 * @returns {string} - نام فیلد به فارسی
 */
export const translateFieldName = (fieldName) => {
  const fieldTranslations = {
    username: 'نام کاربری',
    email: 'ایمیل',
    password: 'رمز عبور',
    password1: 'رمز عبور',
    password2: 'تکرار رمز عبور',
    first_name: 'نام',
    last_name: 'نام خانوادگی',
    phone_number: 'شماره تلفن',
    address: 'آدرس',
    city: 'شهر',
    province: 'استان',
    postal_code: 'کد پستی',
    full_name: 'نام کامل',
    address_line: 'آدرس کامل',
    name: 'نام',
    description: 'توضیحات',
    price: 'قیمت',
    category: 'دسته‌بندی',
    season: 'فصل',
    color: 'رنگ',
    size: 'سایز',
    stock: 'موجودی',
    quantity: 'تعداد',
    rating: 'امتیاز',
    comment: 'نظر',
    image: 'تصویر',
  };

  return fieldTranslations[fieldName] || fieldName;
};

/**
 * فرمت کردن خطاهای فیلدها برای نمایش
 * @param {Object} fieldErrors - خطاهای فیلدها
 * @returns {string} - پیام خطا فرمت شده
 */
export const formatFieldErrors = (fieldErrors) => {
  const errors = [];
  
  Object.keys(fieldErrors).forEach(field => {
    const fieldName = translateFieldName(field);
    const fieldMessages = fieldErrors[field];
    
    if (Array.isArray(fieldMessages)) {
      fieldMessages.forEach(message => {
        errors.push(`${fieldName}: ${message}`);
      });
    }
  });

  return errors.join('\n');
};

/**
 * بررسی اینکه آیا خطا مربوط به احراز هویت است
 * @param {Object} error - شیء خطا
 * @returns {boolean}
 */
export const isAuthError = (error) => {
  const status = error.response?.status || error.status;
  return status === 401 || status === 403;
};

/**
 * بررسی اینکه آیا خطا مربوط به شبکه است
 * @param {Object} error - شیء خطا
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
  const status = error.response?.status || error.status;
  return !status || status === 0 || error.code === 'ECONNABORTED';
};

/**
 * لاگ کردن خطا برای debugging
 * @param {Object} error - شیء خطا
 * @param {string} context - محل وقوع خطا
 */
export const logError = (error, context = '') => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`❌ خطا${context ? ` در ${context}` : ''}`);
    console.error('Error:', error);
    console.error('Status:', error.response?.status || error.status);
    console.error('Message:', getErrorMessage(error));
    console.error('Data:', error.response?.data);
    console.groupEnd();
  }
};

/**
 * ساخت شیء خطای استاندارد
 * @param {Object} error - خطای اصلی
 * @returns {Object} - خطای استاندارد شده
 */
export const normalizeError = (error) => {
  return {
    message: getErrorMessage(error),
    status: error.response?.status || error.status || 0,
    data: error.response?.data || null,
    fieldErrors: getFieldErrors(error),
    isRetryable: isRetryableError(error),
    isAuthError: isAuthError(error),
    isNetworkError: isNetworkError(error),
    originalError: error,
  };
};
