import { apiRequest } from './api';

const reviewService = {
  // دریافت نظرات یک محصول
  getProductReviews: async (productId, page = 1, pageSize = 10) => {
    try {
      const response = await apiRequest.get(
        `/reviews/?product_id=${productId}&page=${page}&page_size=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ثبت نظر جدید
  createReview: async (productId, reviewData) => {
    try {
      const response = await apiRequest.post(`/reviews/`, {
        ...reviewData,
        product_id: productId
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ویرایش نظر
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await apiRequest.put(`/reviews/${reviewId}/`, reviewData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // حذف نظر
  deleteReview: async (reviewId) => {
    try {
      const response = await apiRequest.delete(`/reviews/${reviewId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // دریافت نظرات کاربر
  getUserReviews: async (page = 1, pageSize = 10) => {
    try {
      const response = await apiRequest.get(`/reviews/my-reviews/?page=${page}&page_size=${pageSize}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // بررسی امکان ثبت نظر برای محصول
  canReviewProduct: async (productId) => {
    try {
      // بررسی اینکه آیا کاربر قبلاً نظر داده یا نه
      const response = await apiRequest.get(`/reviews/?product_id=${productId}`);
      const userReviews = response.data.results || response.data;
      
      // اگر کاربر قبلاً نظر داده، نمی‌تواند دوباره نظر بدهد
      return userReviews.length === 0;
    } catch (error) {
      // اگر خطا داشت، فرض می‌کنیم می‌تواند نظر بدهد
      return true;
    }
  },

  // دریافت آمار نظرات محصول
  getProductReviewStats: async (productId) => {
    try {
      const response = await apiRequest.get(`/products/${productId}/review-stats/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // محاسبه میانگین امتیاز
  calculateAverageRating: (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  },

  // گروه‌بندی نظرات بر اساس امتیاز
  groupReviewsByRating: (reviews) => {
    const groups = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    reviews.forEach(review => {
      groups[review.rating]++;
    });
    
    return groups;
  },

  // محاسبه درصد هر امتیاز
  calculateRatingPercentages: (reviews) => {
    const groups = reviewService.groupReviewsByRating(reviews);
    const total = reviews.length;
    
    if (total === 0) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    const percentages = {};
    Object.keys(groups).forEach(rating => {
      percentages[rating] = Math.round((groups[rating] / total) * 100);
    });
    
    return percentages;
  },

  // فیلتر نظرات بر اساس امتیاز
  filterReviewsByRating: async (productId, rating, page = 1) => {
    try {
      const response = await apiRequest.get(
        `/products/${productId}/reviews/?rating=${rating}&page=${page}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // مرتب‌سازی نظرات
  sortReviews: (reviews, sortBy = 'newest') => {
    const sortedReviews = [...reviews];
    
    switch (sortBy) {
      case 'newest':
        return sortedReviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'oldest':
        return sortedReviews.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case 'highest_rating':
        return sortedReviews.sort((a, b) => b.rating - a.rating);
      case 'lowest_rating':
        return sortedReviews.sort((a, b) => a.rating - b.rating);
      default:
        return sortedReviews;
    }
  },

  // گزارش نظر نامناسب
  reportReview: async (reviewId, reason) => {
    try {
      const response = await apiRequest.post(`/reviews/${reviewId}/report/`, {
        reason: reason
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // لایک/دیسلایک نظر
  likeReview: async (reviewId) => {
    try {
      const response = await apiRequest.post(`/reviews/${reviewId}/like/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // حذف لایک نظر
  unlikeReview: async (reviewId) => {
    try {
      const response = await apiRequest.delete(`/reviews/${reviewId}/like/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default reviewService;