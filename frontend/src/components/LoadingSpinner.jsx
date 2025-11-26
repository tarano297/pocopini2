import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'blue', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    white: 'border-white',
    gray: 'border-gray-600',
    green: 'border-green-600',
    red: 'border-red-600'
  };

  return (
    <div className={`inline-block ${className}`}>
      <div
        className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
      />
    </div>
  );
};

// کامپوننت لودینگ صفحه کامل
export const PageLoading = ({ message = 'در حال بارگذاری...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <LoadingSpinner size="xlarge" />
      <p className="mt-4 text-gray-600 text-lg">{message}</p>
    </div>
  );
};

// کامپوننت لودینگ برای دکمه‌ها
export const ButtonLoading = ({ size = 'small' }) => {
  return (
    <div className="flex items-center">
      <LoadingSpinner size={size} color="white" className="ml-2" />
      <span>در حال پردازش...</span>
    </div>
  );
};

export default LoadingSpinner;