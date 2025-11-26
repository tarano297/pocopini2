import React from 'react';

const ErrorMessage = ({ 
  error, 
  onRetry, 
  onClose, 
  type = 'error', 
  className = '',
  showIcon = true 
}) => {
  const typeClasses = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  };

  const iconClasses = {
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
    success: 'text-green-400'
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message || 'خطای نامشخص';

  return (
    <div className={`border rounded-md p-4 ${typeClasses[type]} ${className}`}>
      <div className="flex">
        {showIcon && (
          <div className={`flex-shrink-0 ${iconClasses[type]}`}>
            {getIcon()}
          </div>
        )}
        <div className={`${showIcon ? 'mr-3' : ''} flex-1`}>
          <p className="text-sm font-medium">{errorMessage}</p>
          
          {(onRetry || onClose) && (
            <div className="mt-3 flex space-x-2 space-x-reverse">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="text-sm bg-white px-3 py-1 rounded-md border border-current hover:bg-gray-50 transition-colors"
                >
                  تلاش مجدد
                </button>
              )}
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  بستن
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// کامپوننت خطای صفحه کامل
export const PageError = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center">
        <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">خطایی رخ داد</h2>
        <p className="text-gray-600 mb-6 max-w-md">
          {typeof error === 'string' ? error : error?.message || 'متأسفانه خطایی در بارگذاری صفحه رخ داد.'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            تلاش مجدد
          </button>
        )}
      </div>
    </div>
  );
};

// کامپوننت خطای شبکه
export const NetworkError = ({ onRetry }) => {
  return (
    <ErrorMessage
      error="خطا در اتصال به اینترنت. لطفاً اتصال خود را بررسی کنید."
      type="error"
      onRetry={onRetry}
      className="m-4"
    />
  );
};

export default ErrorMessage;