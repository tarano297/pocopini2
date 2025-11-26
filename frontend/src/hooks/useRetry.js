import { useState, useCallback, useEffect } from 'react';
import { useToast } from '../components/Toast';

// Hook برای مدیریت retry mechanism
export const useRetry = (maxRetries = 3, retryDelay = 1000) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const { showError, showWarning } = useToast();

  const executeWithRetry = useCallback(async (asyncFunction, options = {}) => {
    const {
      onSuccess,
      onError,
      onMaxRetriesReached,
      showToastOnError = true,
      customErrorMessage
    } = options;

    let currentRetry = 0;
    
    const attempt = async () => {
      try {
        setIsRetrying(currentRetry > 0);
        const result = await asyncFunction();
        
        // موفقیت
        setRetryCount(0);
        setIsRetrying(false);
        
        if (onSuccess) {
          onSuccess(result);
        }
        
        return result;
      } catch (error) {
        currentRetry++;
        setRetryCount(currentRetry);
        
        // بررسی اینکه آیا باید retry کند
        const shouldRetry = currentRetry < maxRetries && isRetryableError(error);
        
        if (shouldRetry) {
          if (showToastOnError && currentRetry === 1) {
            showWarning(`تلاش مجدد... (${currentRetry}/${maxRetries})`);
          }
          
          // تاخیر قبل از retry
          await new Promise(resolve => setTimeout(resolve, retryDelay * currentRetry));
          return attempt();
        } else {
          // حداکثر تلاش رسیده یا خطا قابل retry نیست
          setIsRetrying(false);
          
          if (currentRetry >= maxRetries && onMaxRetriesReached) {
            onMaxRetriesReached(error);
          }
          
          if (showToastOnError) {
            const errorMessage = customErrorMessage || getErrorMessage(error);
            showError(errorMessage);
          }
          
          if (onError) {
            onError(error);
          }
          
          throw error;
        }
      }
    };

    return attempt();
  }, [maxRetries, retryDelay, showError, showWarning]);

  const reset = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  return {
    executeWithRetry,
    retryCount,
    isRetrying,
    reset,
    hasRetriesLeft: retryCount < maxRetries
  };
};

// بررسی اینکه آیا خطا قابل retry است
const isRetryableError = (error) => {
  // خطاهای شبکه
  if (!error.status || error.status === 0) {
    return true;
  }
  
  // خطاهای سرور (5xx)
  if (error.status >= 500) {
    return true;
  }
  
  // خطای timeout
  if (error.code === 'ECONNABORTED') {
    return true;
  }
  
  // خطاهای موقت
  const retryableStatuses = [408, 429, 502, 503, 504];
  if (retryableStatuses.includes(error.status)) {
    return true;
  }
  
  return false;
};

// دریافت پیام خطا
const getErrorMessage = (error) => {
  if (error.message) {
    return error.message;
  }
  
  if (error.status === 0) {
    return 'خطا در اتصال به اینترنت';
  }
  
  if (error.status >= 500) {
    return 'خطا در سرور. لطفاً بعداً تلاش کنید.';
  }
  
  if (error.status === 404) {
    return 'منبع مورد نظر یافت نشد';
  }
  
  if (error.status === 403) {
    return 'شما دسترسی لازم را ندارید';
  }
  
  if (error.status === 401) {
    return 'لطفاً مجدداً وارد شوید';
  }
  
  return 'خطای نامشخص رخ داد';
};

// Hook برای مدیریت وضعیت آنلاین/آفلاین
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showSuccess('اتصال اینترنت برقرار شد');
    };

    const handleOffline = () => {
      setIsOnline(false);
      showError('اتصال اینترنت قطع شد');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showError, showSuccess]);

  return isOnline;
};

// Hook برای مدیریت debounce
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};