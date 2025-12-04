import { apiRequest } from './api';

const cartService = {
  // دریافت سبد خرید
  getCart: async () => {
    try {
      const response = await apiRequest.get('/orders/cart/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // افزودن محصول به سبد خرید
  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await apiRequest.post('/orders/cart/add/', {
        product_id: productId,
        quantity: quantity,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // به‌روزرسانی تعداد محصول در سبد
  updateCartItem: async (itemId, quantity) => {
    try {
      const response = await apiRequest.put(`/orders/cart/update/${itemId}/`, {
        quantity: quantity,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // حذف محصول از سبد خرید
  removeFromCart: async (itemId) => {
    try {
      const response = await apiRequest.delete(`/orders/cart/remove/${itemId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // خالی کردن سبد خرید
  clearCart: async () => {
    try {
      const response = await apiRequest.delete('/orders/cart/clear/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // محاسبه قیمت کل سبد
  calculateTotal: (cartItems) => {
    if (!cartItems || !Array.isArray(cartItems)) return 0;
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || item.price || 0;
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0);
  },

  // محاسبه تعداد کل اقلام
  calculateItemCount: (cartItems) => {
    if (!cartItems || !Array.isArray(cartItems)) return 0;
    return cartItems.reduce((count, item) => {
      return count + (item.quantity || 0);
    }, 0);
  },

  // بررسی موجودی محصول
  checkStock: async (productId, quantity) => {
    try {
      const response = await apiRequest.post('/cart/check-stock/', {
        product_id: productId,
        quantity: quantity,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // اعمال کد تخفیف
  applyCoupon: async (couponCode) => {
    try {
      const response = await apiRequest.post('/cart/apply-coupon/', {
        coupon_code: couponCode,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // حذف کد تخفیف
  removeCoupon: async () => {
    try {
      const response = await apiRequest.delete('/cart/remove-coupon/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ذخیره سبد خرید در localStorage (برای کاربران غیر احراز هویت شده)
  saveCartToLocal: (cartItems) => {
    try {
      localStorage.setItem('guest_cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('خطا در ذخیره سبد خرید محلی:', error);
    }
  },

  // دریافت سبد خرید از localStorage
  getCartFromLocal: () => {
    try {
      const cartStr = localStorage.getItem('guest_cart');
      return cartStr ? JSON.parse(cartStr) : [];
    } catch (error) {
      console.error('خطا در خواندن سبد خرید محلی:', error);
      return [];
    }
  },

  // حذف سبد خرید از localStorage
  clearLocalCart: () => {
    localStorage.removeItem('guest_cart');
  },

  // انتقال سبد خرید محلی به سرور (هنگام ورود)
  syncLocalCartToServer: async () => {
    try {
      const localCart = cartService.getCartFromLocal();
      
      if (localCart.length > 0) {
        const promises = localCart.map(item => 
          cartService.addToCart(item.product_id, item.quantity)
        );
        
        await Promise.all(promises);
        cartService.clearLocalCart();
      }
    } catch (error) {
      console.error('خطا در همگام‌سازی سبد خرید:', error);
    }
  },
};

export default cartService;