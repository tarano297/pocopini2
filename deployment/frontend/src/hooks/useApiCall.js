import { useState, useCallback } from 'react';
import { useToast } from '../components/Toast';
import { getErrorMessage, isRetryableError } from '../utils/errorUtils';

/**
 * Hook برای مدیریت فراخوانی APIها با مدیریت خودکار خطا و toast
 * @param {Object} options - تنظیمات
 * @returns {Object} - توابع و state های مورد نیاز
 */
export const useApiCall = (options = {}) => {
  const {
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'عملیات با موفقیت انجام شد',
    retryCount = 3,
    retryDelay = 1000,
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { showSuccess, showError, showWarning } = useToast();

  /**
   * اجرای فراخوانی API با مدیریت خودکار
   */
  const execute = useCallback(async (apiFunction, customOptions = {}) => {
    const {
      onSuccess,
      onError,
      customSuccessMessage,
      customErrorMessage,
      showSuccess: showSuccessOverride,
      showError: showErrorOverride,
    } = customOptions;

    setLoading(true);
    setError(null);

    let currentAttempt = 0;
    const maxAttempts = retryCount + 1;

    const attemptCall = async () => {
      try {
        const result = await apiFunction();
        
        // موفقیت
        setData(result);
        setLoading(false);
        
        // نمایش toast موفقیت
        const shouldShowSuccess = showSuccessOverride !== undefined 
          ? showSuccessOverride 
          : showSuccessToast;
          
        if (shouldShowSuccess) {
          showSuccess(customSuccessMessage || successMessage);
        }
        
        // فراخوانی callback موفقیت
        if (onSuccess) {
          onSuccess(result);
        }
        
        return result;
      } catch (err) {
        currentAttempt++;
        
        // بررسی امکان retry
        const canRetry = currentAttempt < maxAttempts && isRetryableError(err);
        
        if (canRetry) {
          // نمایش پیام retry
          showWarning(`تلاش مجدد... (${currentAttempt}/${retryCount})`);
          
          // تاخیر قبل از retry
          await new Promise(resolve => 
            setTimeout(resolve, retryDelay * currentAttempt)
          );
          
          return attemptCall();
        } else {
          // خطای نهایی
          setError(err);
          setLoading(false);
          
          // نمایش toast خطا
          const shouldShowError = showErrorOverride !== undefined 
            ? showErrorOverride 
            : showErrorToast;
            
          if (shouldShowError) {
            const errorMessage = customErrorMessage || getErrorMessage(err);
            showError(errorMessage);
          }
          
          // فراخوانی callback خطا
          if (onError) {
            onError(err);
          }
          
          throw err;
        }
      }
    };

    return attemptCall();
  }, [
    showSuccessToast,
    showErrorToast,
    successMessage,
    retryCount,
    retryDelay,
    showSuccess,
    showError,
    showWarning,
  ]);

  /**
   * ریست کردن state
   */
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    execute,
    loading,
    error,
    data,
    reset,
  };
};

/**
 * Hook ساده‌تر برای فراخوانی‌های معمولی
 */
export const useSimpleApiCall = () => {
  const { showSuccess, showError } = useToast();

  const call = useCallback(async (
    apiFunction,
    {
      successMessage,
      errorMessage,
      showSuccessToast = false,
      showErrorToast = true,
    } = {}
  ) => {
    try {
      const result = await apiFunction();
      
      if (showSuccessToast && successMessage) {
        showSuccess(successMessage);
      }
      
      return result;
    } catch (error) {
      if (showErrorToast) {
        const message = errorMessage || getErrorMessage(error);
        showError(message);
      }
      
      throw error;
    }
  }, [showSuccess, showError]);

  return call;
};

export default useApiCall;
