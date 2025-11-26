import axios from 'axios';
import { getErrorMessage, normalizeError, logError } from '../utils/errorUtils';

// تنظیم baseURL برای API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// ایجاد instance اصلی Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor برای اضافه کردن JWT token به درخواست‌ها
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor برای مدیریت پاسخ‌ها و خطاها
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // لاگ کردن خطا در حالت development
    logError(error, originalRequest?.url);

    // اگر خطای 401 (Unauthorized) دریافت شد و قبلاً تلاش نشده
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          // تلاش برای تازه‌سازی token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });

          const newAccessToken = response.data.access;
          localStorage.setItem('access_token', newAccessToken);

          // تکرار درخواست اصلی با token جدید
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // اگر refresh token نیز منقضی شده، کاربر را خارج کن
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        // هدایت به صفحه ورود
        window.location.href = '/login';
        return Promise.reject(normalizeError(refreshError));
      }
    }

    // استاندارد کردن خطا و بازگشت
    return Promise.reject(normalizeError(error));
  }
);

// توابع کمکی برای انواع درخواست‌ها
export const apiRequest = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
};

// تابع برای آپلود فایل
export const uploadFile = (url, file, onProgress = null) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

// تابع برای تنظیم token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('access_token', token);
  } else {
    localStorage.removeItem('access_token');
  }
};

// تابع برای حذف تمام اطلاعات احراز هویت
export const clearAuth = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

export default api;