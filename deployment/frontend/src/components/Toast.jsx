import React, { useState, useEffect, createContext, useContext } from 'react';

// Context برای مدیریت Toast ها
const ToastContext = createContext();

// انواع Toast
const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// کامپوننت Toast منفرد
const Toast = ({ id, type, message, duration = 5000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getToastStyles = () => {
    const baseStyles = "flex items-center p-4 mb-4 rounded-lg shadow-lg max-w-sm w-full";
    
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return `${baseStyles} bg-green-100 text-green-800 border border-green-200`;
      case TOAST_TYPES.ERROR:
        return `${baseStyles} bg-red-100 text-red-800 border border-red-200`;
      case TOAST_TYPES.WARNING:
        return `${baseStyles} bg-yellow-100 text-yellow-800 border border-yellow-200`;
      case TOAST_TYPES.INFO:
        return `${baseStyles} bg-blue-100 text-blue-800 border border-blue-200`;
      default:
        return `${baseStyles} bg-gray-100 text-gray-800 border border-gray-200`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return (
          <svg className="w-5 h-5 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case TOAST_TYPES.ERROR:
        return (
          <svg className="w-5 h-5 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case TOAST_TYPES.WARNING:
        return (
          <svg className="w-5 h-5 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case TOAST_TYPES.INFO:
        return (
          <svg className="w-5 h-5 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={getToastStyles()}>
      {getIcon()}
      <div className="flex-1 text-sm font-medium">
        {message}
      </div>
      <button
        onClick={() => onClose(id)}
        className="mr-2 text-current hover:opacity-75 transition-opacity"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// Provider برای مدیریت Toast ها
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = TOAST_TYPES.INFO, duration = 5000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  // توابع کمکی
  const showSuccess = (message, duration) => addToast(message, TOAST_TYPES.SUCCESS, duration);
  const showError = (message, duration) => addToast(message, TOAST_TYPES.ERROR, duration);
  const showWarning = (message, duration) => addToast(message, TOAST_TYPES.WARNING, duration);
  const showInfo = (message, duration) => addToast(message, TOAST_TYPES.INFO, duration);

  const contextValue = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Container برای نمایش Toast ها */}
      <div className="fixed top-4 left-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Hook برای استفاده از Toast
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast باید داخل ToastProvider استفاده شود');
  }
  
  return context;
};

// کامپوننت برای نمایش خطاهای شبکه
export const NetworkErrorToast = ({ error, onRetry }) => {
  const { showError } = useToast();

  useEffect(() => {
    if (error) {
      let message = 'خطا در اتصال به اینترنت';
      
      if (error.status === 0) {
        message = 'عدم دسترسی به اینترنت. لطفاً اتصال خود را بررسی کنید.';
      } else if (error.status >= 500) {
        message = 'خطا در سرور. لطفاً بعداً تلاش کنید.';
      } else if (error.status === 404) {
        message = 'صفحه یا منبع مورد نظر یافت نشد.';
      } else if (error.status === 403) {
        message = 'شما دسترسی لازم برای این عملیات را ندارید.';
      } else if (error.status === 401) {
        message = 'لطفاً مجدداً وارد شوید.';
      }

      showError(message, 7000);
    }
  }, [error, showError]);

  return null;
};

export { TOAST_TYPES };
export default Toast;