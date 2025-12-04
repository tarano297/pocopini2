import { apiRequest, setAuthToken, clearAuth } from './api';

const authService = {
  // ثبت‌نام کاربر جدید
  register: async (userData) => {
    try {
      const response = await apiRequest.post('/auth/register/', userData);
      
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setAuthToken(response.data.access);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ورود کاربر
  login: async (credentials) => {
    try {
      const response = await apiRequest.post('/auth/login/', credentials);
      
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setAuthToken(response.data.access);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // خروج کاربر
  logout: () => {
    clearAuth();
    window.location.href = '/';
  },

  // دریافت اطلاعات پروفایل
  getProfile: async () => {
    try {
      const response = await apiRequest.get('/auth/profile/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // به‌روزرسانی اطلاعات پروفایل
  updateProfile: async (profileData) => {
    try {
      const response = await apiRequest.put('/auth/profile/', profileData);
      
      // به‌روزرسانی اطلاعات کاربر در localStorage
      const updatedUser = response.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      throw error;
    }
  },

  // بررسی وضعیت احراز هویت
  isAuthenticated: () => {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // دریافت اطلاعات کاربر از localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // دریافت token فعلی
  getToken: () => {
    return localStorage.getItem('access_token');
  },

  // تغییر رمز عبور
  changePassword: async (passwordData) => {
    try {
      const response = await apiRequest.post('/auth/change-password/', passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // بازیابی رمز عبور
  resetPassword: async (email) => {
    try {
      const response = await apiRequest.post('/auth/reset-password/', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // تایید بازیابی رمز عبور
  confirmResetPassword: async (resetData) => {
    try {
      const response = await apiRequest.post('/auth/reset-password-confirm/', resetData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;