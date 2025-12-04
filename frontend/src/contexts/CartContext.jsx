import React, { createContext, useContext, useReducer, useEffect } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

// ایجاد Context
const CartContext = createContext();

// انواع Action ها
const CART_ACTIONS = {
  FETCH_CART_START: 'FETCH_CART_START',
  FETCH_CART_SUCCESS: 'FETCH_CART_SUCCESS',
  FETCH_CART_FAILURE: 'FETCH_CART_FAILURE',
  ADD_TO_CART_START: 'ADD_TO_CART_START',
  ADD_TO_CART_SUCCESS: 'ADD_TO_CART_SUCCESS',
  ADD_TO_CART_FAILURE: 'ADD_TO_CART_FAILURE',
  UPDATE_QUANTITY_START: 'UPDATE_QUANTITY_START',
  UPDATE_QUANTITY_SUCCESS: 'UPDATE_QUANTITY_SUCCESS',
  UPDATE_QUANTITY_FAILURE: 'UPDATE_QUANTITY_FAILURE',
  REMOVE_FROM_CART_START: 'REMOVE_FROM_CART_START',
  REMOVE_FROM_CART_SUCCESS: 'REMOVE_FROM_CART_SUCCESS',
  REMOVE_FROM_CART_FAILURE: 'REMOVE_FROM_CART_FAILURE',
  CLEAR_CART_START: 'CLEAR_CART_START',
  CLEAR_CART_SUCCESS: 'CLEAR_CART_SUCCESS',
  CLEAR_CART_FAILURE: 'CLEAR_CART_FAILURE',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_SHIPPING_METHOD: 'SET_SHIPPING_METHOD',
};

// حالت اولیه
const initialState = {
  cartItems: [],
  totalPrice: 0,
  itemCount: 0,
  isLoading: false,
  error: null,
  shippingMethod: 'standard', // 'standard' یا 'express'
};

// Reducer برای مدیریت state
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.FETCH_CART_START:
    case CART_ACTIONS.ADD_TO_CART_START:
    case CART_ACTIONS.UPDATE_QUANTITY_START:
    case CART_ACTIONS.REMOVE_FROM_CART_START:
    case CART_ACTIONS.CLEAR_CART_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case CART_ACTIONS.FETCH_CART_SUCCESS:
      const fetchedItems = action.payload.items || [];
      return {
        ...state,
        cartItems: fetchedItems,
        totalPrice: cartService.calculateTotal(fetchedItems),
        itemCount: cartService.calculateItemCount(fetchedItems),
        isLoading: false,
        error: null,
      };

    case CART_ACTIONS.ADD_TO_CART_SUCCESS:
    case CART_ACTIONS.UPDATE_QUANTITY_SUCCESS:
    case CART_ACTIONS.REMOVE_FROM_CART_SUCCESS:
      const updatedItems = action.payload.items || [];
      return {
        ...state,
        cartItems: updatedItems,
        totalPrice: cartService.calculateTotal(updatedItems),
        itemCount: cartService.calculateItemCount(updatedItems),
        isLoading: false,
        error: null,
      };

    case CART_ACTIONS.CLEAR_CART_SUCCESS:
      return {
        ...state,
        cartItems: [],
        totalPrice: 0,
        itemCount: 0,
        isLoading: false,
        error: null,
      };

    case CART_ACTIONS.FETCH_CART_FAILURE:
    case CART_ACTIONS.ADD_TO_CART_FAILURE:
    case CART_ACTIONS.UPDATE_QUANTITY_FAILURE:
    case CART_ACTIONS.REMOVE_FROM_CART_FAILURE:
    case CART_ACTIONS.CLEAR_CART_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case CART_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case CART_ACTIONS.SET_SHIPPING_METHOD:
      return {
        ...state,
        shippingMethod: action.payload,
      };

    default:
      return state;
  }
};

// Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  // بارگذاری سبد خرید هنگام mount یا تغییر وضعیت احراز هویت
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // برای کاربران غیر احراز هویت شده، سبد خرید را از localStorage بارگذاری کن
      const localCart = cartService.getCartFromLocal();
      dispatch({
        type: CART_ACTIONS.FETCH_CART_SUCCESS,
        payload: { items: localCart },
      });
    }
  }, [isAuthenticated]);

  // تابع دریافت سبد خرید
  const fetchCart = async () => {
    dispatch({ type: CART_ACTIONS.FETCH_CART_START });

    try {
      const cartData = await cartService.getCart();
      dispatch({
        type: CART_ACTIONS.FETCH_CART_SUCCESS,
        payload: cartData,
      });
      return cartData;
    } catch (error) {
      // اگر endpoint وجود نداشت، از localStorage استفاده کن
      if (error.status === 404) {
        const localCart = cartService.getCartFromLocal();
        dispatch({
          type: CART_ACTIONS.FETCH_CART_SUCCESS,
          payload: { items: localCart },
        });
        return { items: localCart };
      }
      
      const errorMessage = error.message || 'خطا در دریافت سبد خرید';
      dispatch({
        type: CART_ACTIONS.FETCH_CART_FAILURE,
        payload: errorMessage,
      });
      // Don't throw error, just log it
      console.warn('Cart API not available, using local storage');
      
      // Use local cart as fallback
      const localCart = cartService.getCartFromLocal();
      dispatch({
        type: CART_ACTIONS.FETCH_CART_SUCCESS,
        payload: { items: localCart },
      });
      return { items: localCart };
    }
  };

  // تابع افزودن به سبد خرید
  const addToCart = async (productId, quantity = 1) => {
    dispatch({ type: CART_ACTIONS.ADD_TO_CART_START });

    try {
      if (isAuthenticated) {
        // برای کاربران احراز هویت شده، از API استفاده کن
        const cartData = await cartService.addToCart(productId, quantity);
        
        // اگر response شامل items بود، از اون استفاده کن
        if (cartData && cartData.items) {
          dispatch({
            type: CART_ACTIONS.ADD_TO_CART_SUCCESS,
            payload: cartData,
          });
        } else {
          // در غیر این صورت، سبد خرید رو دوباره fetch کن
          await fetchCart();
        }
        return cartData;
      } else {
        // برای کاربران غیر احراز هویت شده، در localStorage ذخیره کن
        const localCart = cartService.getCartFromLocal();
        const existingItemIndex = localCart.findIndex(
          item => item.product_id === productId
        );

        if (existingItemIndex > -1) {
          localCart[existingItemIndex].quantity += quantity;
        } else {
          localCart.push({ product_id: productId, quantity });
        }

        cartService.saveCartToLocal(localCart);
        dispatch({
          type: CART_ACTIONS.ADD_TO_CART_SUCCESS,
          payload: { items: localCart },
        });
        return { items: localCart };
      }
    } catch (error) {
      const errorMessage = error.message || 'خطا در افزودن به سبد خرید';
      dispatch({
        type: CART_ACTIONS.ADD_TO_CART_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };

  // تابع به‌روزرسانی تعداد
  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      throw new Error('تعداد باید حداقل ۱ باشد');
    }

    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY_START });

    try {
      if (isAuthenticated) {
        // برای کاربران احراز هویت شده، از API استفاده کن
        const cartData = await cartService.updateCartItem(itemId, quantity);
        dispatch({
          type: CART_ACTIONS.UPDATE_QUANTITY_SUCCESS,
          payload: cartData,
        });
        return cartData;
      } else {
        // برای کاربران غیر احراز هویت شده، در localStorage به‌روزرسانی کن
        const localCart = cartService.getCartFromLocal();
        const itemIndex = localCart.findIndex(item => item.product_id === itemId);

        if (itemIndex > -1) {
          localCart[itemIndex].quantity = quantity;
          cartService.saveCartToLocal(localCart);
          dispatch({
            type: CART_ACTIONS.UPDATE_QUANTITY_SUCCESS,
            payload: { items: localCart },
          });
          return { items: localCart };
        } else {
          throw new Error('محصول در سبد خرید یافت نشد');
        }
      }
    } catch (error) {
      const errorMessage = error.message || 'خطا در به‌روزرسانی تعداد';
      dispatch({
        type: CART_ACTIONS.UPDATE_QUANTITY_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };

  // تابع حذف از سبد خرید
  const removeFromCart = async (itemId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART_START });

    try {
      if (isAuthenticated) {
        // برای کاربران احراز هویت شده، از API استفاده کن
        const cartData = await cartService.removeFromCart(itemId);
        dispatch({
          type: CART_ACTIONS.REMOVE_FROM_CART_SUCCESS,
          payload: cartData,
        });
        return cartData;
      } else {
        // برای کاربران غیر احراز هویت شده، از localStorage حذف کن
        const localCart = cartService.getCartFromLocal();
        const filteredCart = localCart.filter(item => item.product_id !== itemId);
        cartService.saveCartToLocal(filteredCart);
        dispatch({
          type: CART_ACTIONS.REMOVE_FROM_CART_SUCCESS,
          payload: { items: filteredCart },
        });
        return { items: filteredCart };
      }
    } catch (error) {
      const errorMessage = error.message || 'خطا در حذف از سبد خرید';
      dispatch({
        type: CART_ACTIONS.REMOVE_FROM_CART_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };

  // تابع خالی کردن سبد خرید
  const clearCart = async () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART_START });

    try {
      if (isAuthenticated) {
        // برای کاربران احراز هویت شده، از API استفاده کن
        await cartService.clearCart();
        dispatch({
          type: CART_ACTIONS.CLEAR_CART_SUCCESS,
        });
      } else {
        // برای کاربران غیر احراز هویت شده، localStorage را پاک کن
        cartService.clearLocalCart();
        dispatch({
          type: CART_ACTIONS.CLEAR_CART_SUCCESS,
        });
      }
    } catch (error) {
      const errorMessage = error.message || 'خطا در خالی کردن سبد خرید';
      dispatch({
        type: CART_ACTIONS.CLEAR_CART_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };

  // تابع پاک کردن خطا
  const clearError = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_ERROR });
  };

  // تابع بررسی وجود محصول در سبد
  const isInCart = (productId) => {
    if (!productId || !state.cartItems || state.cartItems.length === 0) {
      return false;
    }
    
    return state.cartItems.some(item => {
      const itemProductId = item.product?.id || item.product_id;
      return itemProductId === productId;
    });
  };

  // تابع دریافت تعداد یک محصول در سبد
  const getItemQuantity = (productId) => {
    if (!productId || !state.cartItems || state.cartItems.length === 0) {
      return 0;
    }
    
    const item = state.cartItems.find(item => {
      const itemProductId = item.product?.id || item.product_id;
      return itemProductId === productId;
    });
    
    return item ? item.quantity : 0;
  };

  // تابع تنظیم روش ارسال
  const setShippingMethod = (method) => {
    dispatch({ 
      type: CART_ACTIONS.SET_SHIPPING_METHOD, 
      payload: method 
    });
  };

  // تابع محاسبه هزینه ارسال
  const getShippingCost = () => {
    // هزینه ارسال بر اساس روش انتخابی
    if (state.shippingMethod === 'express') {
      // پست پیشتاز: 50,000 تومان
      return 50000;
    } else {
      // پست عادی: 30,000 تومان
      return 30000;
    }
  };

  // تابع محاسبه مجموع نهایی (قیمت کل + هزینه ارسال)
  const getFinalTotal = () => {
    return state.totalPrice + getShippingCost();
  };

  // مقادیری که در Context در دسترس خواهند بود
  const contextValue = {
    // State
    cartItems: state.cartItems,
    items: state.cartItems, // alias برای سازگاری با کامپوننت‌های موجود
    totalPrice: state.totalPrice,
    itemCount: state.itemCount,
    isLoading: state.isLoading,
    error: state.error,
    shippingMethod: state.shippingMethod,

    // Actions
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    clearError,
    setShippingMethod,

    // Utilities
    isInCart,
    getItemQuantity,
    getShippingCost,
    getFinalTotal,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Hook برای استفاده از CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart باید داخل CartProvider استفاده شود');
  }
  
  return context;
};

export default CartContext;
