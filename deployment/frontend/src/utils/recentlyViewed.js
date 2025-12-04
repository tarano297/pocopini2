/**
 * Utility برای مدیریت محصولات اخیراً مشاهده شده
 */

const MAX_RECENT_PRODUCTS = 12;
const STORAGE_KEY = 'recentlyViewed';

export const recentlyViewedUtils = {
  /**
   * افزودن محصول به لیست اخیراً مشاهده شده
   */
  addProduct: (product) => {
    try {
      const recent = recentlyViewedUtils.getProducts();
      
      // حذف محصول اگر قبلاً وجود داشته
      const filtered = recent.filter(p => p.id !== product.id);
      
      // اضافه کردن محصول به ابتدای لیست
      const updated = [
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          viewedAt: new Date().toISOString()
        },
        ...filtered
      ].slice(0, MAX_RECENT_PRODUCTS);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error adding to recently viewed:', error);
      return [];
    }
  },

  /**
   * دریافت لیست محصولات اخیراً مشاهده شده
   */
  getProducts: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting recently viewed:', error);
      return [];
    }
  },

  /**
   * پاک کردن همه محصولات
   */
  clearAll: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing recently viewed:', error);
    }
  },

  /**
   * حذف یک محصول خاص
   */
  removeProduct: (productId) => {
    try {
      const recent = recentlyViewedUtils.getProducts();
      const filtered = recent.filter(p => p.id !== productId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return filtered;
    } catch (error) {
      console.error('Error removing from recently viewed:', error);
      return [];
    }
  }
};

export default recentlyViewedUtils;
