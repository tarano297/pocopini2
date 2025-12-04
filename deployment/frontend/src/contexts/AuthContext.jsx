import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../services/authService';
import cartService from '../services/cartService';

// ایجاد Context
const AuthContext = createContext();

// انواع Action ها
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING',
};

// حالت اولیه
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Reducer برای مدیریت state
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.access,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
      };

    case AUTH_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: action.payload,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};

// Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // بررسی وضعیت احراز هویت هنگام بارگذاری اولیه
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('access_token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: { user, access: token },
          });
        } catch (error) {
          console.error('خطا در پارس کردن اطلاعات کاربر:', error);
          logout();
        }
      }
    };

    initializeAuth();
  }, []);

  // تابع ورود
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await authService.login(credentials);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: response,
      });

      // همگام‌سازی سبد خرید محلی با سرور
      await cartService.syncLocalCartToServer();

      return response;
    } catch (error) {
      const errorMessage = error.message || 'خطا در ورود به سیستم';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };

  // تابع ثبت‌نام
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });

    try {
      const response = await authService.register(userData);
      
      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: response,
      });

      // همگام‌سازی سبد خرید محلی با سرور
      await cartService.syncLocalCartToServer();

      return response;
    } catch (error) {
      const errorMessage = error.message || 'خطا در ثبت‌نام';
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };

  // تابع خروج
  const logout = () => {
    authService.logout();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // تابع به‌روزرسانی پروفایل
  const updateProfile = async (profileData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

    try {
      const updatedUser = await authService.updateProfile(profileData);
      
      dispatch({
        type: AUTH_ACTIONS.UPDATE_PROFILE,
        payload: updatedUser,
      });

      return updatedUser;
    } catch (error) {
      const errorMessage = error.message || 'خطا در به‌روزرسانی پروفایل';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });
      throw error;
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // تابع تغییر رمز عبور
  const changePassword = async (passwordData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

    try {
      const response = await authService.changePassword(passwordData);
      return response;
    } catch (error) {
      const errorMessage = error.message || 'خطا در تغییر رمز عبور';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });
      throw error;
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // تابع بازیابی رمز عبور
  const resetPassword = async (email) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

    try {
      const response = await authService.resetPassword(email);
      return response;
    } catch (error) {
      const errorMessage = error.message || 'خطا در ارسال ایمیل بازیابی';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });
      throw error;
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // تابع پاک کردن خطا
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // تابع بررسی دسترسی
  const hasPermission = (permission) => {
    if (!state.user) return false;
    
    // اگر کاربر ادمین است، همه دسترسی‌ها را دارد
    if (state.user.is_staff || state.user.is_superuser) return true;
    
    // بررسی دسترسی‌های خاص
    return state.user.permissions?.includes(permission) || false;
  };

  // تابع بررسی نقش کاربر
  const hasRole = (role) => {
    if (!state.user) return false;
    
    switch (role) {
      case 'admin':
        return state.user.is_superuser;
      case 'staff':
        return state.user.is_staff;
      case 'user':
        return !state.user.is_staff && !state.user.is_superuser;
      default:
        return false;
    }
  };

  // مقادیری که در Context در دسترس خواهند بود
  const contextValue = {
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    resetPassword,
    clearError,

    // Utilities
    hasPermission,
    hasRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook برای استفاده از AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth باید داخل AuthProvider استفاده شود');
  }
  
  return context;
};

// HOC برای محافظت از کامپوننت‌ها
export const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            دسترسی محدود
          </h2>
          <p className="text-gray-600 mb-8">
            برای دسترسی به این صفحه باید وارد شوید
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            ورود به سیستم
          </button>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default AuthContext;