import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  requireRole = null,
  fallback = null 
}) => {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth();

  // در حال بارگذاری
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // نیاز به احراز هویت دارد اما کاربر وارد نشده
  if (requireAuth && !isAuthenticated) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            دسترسی محدود
          </h2>
          <p className="text-gray-600 mb-6">
            برای دسترسی به این صفحه باید وارد حساب کاربری خود شوید.
          </p>
          <div className="space-y-3">
            <a
              href="/login"
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors text-center"
            >
              ورود به حساب کاربری
            </a>
            <a
              href="/register"
              className="block w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors text-center"
            >
              ایجاد حساب جدید
            </a>
          </div>
        </div>
      </div>
    );
  }

  // نیاز به نقش خاص دارد اما کاربر آن نقش را ندارد
  if (requireRole && !hasRole(requireRole)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            عدم دسترسی
          </h2>
          <p className="text-gray-600 mb-6">
            شما دسترسی لازم برای مشاهده این صفحه را ندارید.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            بازگشت
          </button>
        </div>
      </div>
    );
  }

  // همه شرایط برقرار است، کامپوننت را نمایش بده
  return children;
};

// HOC برای محافظت از کامپوننت‌ها
export const withProtectedRoute = (WrappedComponent, options = {}) => {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute {...options}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    );
  };
};

// کامپوننت برای نمایش محتوا بر اساس وضعیت احراز هویت
export const AuthGuard = ({ 
  children, 
  fallback = null, 
  requireAuth = true,
  requireRole = null 
}) => {
  const { isAuthenticated, isLoading, hasRole } = useAuth();

  if (isLoading) {
    return <LoadingSpinner size="small" />;
  }

  if (requireAuth && !isAuthenticated) {
    return fallback;
  }

  if (requireRole && !hasRole(requireRole)) {
    return fallback;
  }

  return children;
};

export default ProtectedRoute;