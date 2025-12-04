import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import reviewService from '../services/reviewService';
import LoadingSpinner from './LoadingSpinner';
import { priceUtils } from '../utils';

const ProductReviews = ({ productId }) => {
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    loadReviews();
    if (isAuthenticated) {
      checkCanReview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, isAuthenticated]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getProductReviews(productId);
      setReviews(response.results || response);
      
      // محاسبه میانگین امتیاز
      if (response.results?.length > 0 || response.length > 0) {
        const avg = reviewService.calculateAverageRating(response.results || response);
        setAverageRating(avg);
      }
    } catch (err) {
      console.error('خطا در دریافت نظرات:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkCanReview = async () => {
    try {
      const result = await reviewService.canReviewProduct(productId);
      setCanReview(result);
    } catch (err) {
      setCanReview(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!reviewForm.comment.trim()) {
      alert('لطفاً نظر خود را بنویسید');
      return;
    }

    if (reviewForm.rating < 1 || reviewForm.rating > 5) {
      alert('لطفاً امتیاز خود را انتخاب کنید (۱ تا ۵ ستاره)');
      return;
    }

    try {
      setSubmitting(true);
      await reviewService.createReview(productId, reviewForm);
      alert('نظر شما با موفقیت ثبت شد و پس از تایید نمایش داده می‌شود');
      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: '' });
      loadReviews();
      setCanReview(false);
    } catch (err) {
      const errorMsg = err.data?.detail || err.data?.non_field_errors?.[0] || err.message || 'خطا در ثبت نظر';
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false, onRate = null) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => onRate(star) : undefined}
            className={`${
              interactive 
                ? 'cursor-pointer hover:scale-125 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded' 
                : ''
            }`}
            disabled={!interactive}
            title={interactive ? `${star} ستاره` : undefined}
          >
            <svg
              className={`${interactive ? 'w-8 h-8' : 'w-5 h-5'} ${
                star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              } ${interactive && star <= rating ? 'drop-shadow-md' : ''}`}
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="medium" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">نظرات کاربران</h2>
        
        {reviews.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    {priceUtils.toPersianDigits(averageRating)}
                  </div>
                  <div className="text-sm text-gray-600">از ۵</div>
                </div>
                <div>
                  {renderStars(Math.round(averageRating))}
                  <div className="text-sm text-gray-600 mt-1">
                    بر اساس {priceUtils.toPersianDigits(reviews.length)} نظر
                  </div>
                </div>
              </div>
              
              {isAuthenticated && canReview && !showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  ثبت نظر
                </button>
              )}
            </div>
          </div>
        )}

        {reviews.length === 0 && isAuthenticated && canReview && !showReviewForm && (
          <div className="text-center mb-6">
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              اولین نظر را شما ثبت کنید
            </button>
          </div>
        )}
      </div>



      {/* فرم ثبت نظر */}
      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">نظر خود را بنویسید</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              امتیاز شما: {priceUtils.toPersianDigits(reviewForm.rating)} از ۵
            </label>
            <div className="flex items-center gap-2">
              {renderStars(reviewForm.rating, true, (rating) => 
                setReviewForm({ ...reviewForm, rating })
              )}
              <span className="text-sm text-gray-600 mr-2">
                (روی ستاره‌ها کلیک کنید)
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نظر شما
            </label>
            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="نظر خود را درباره این محصول بنویسید..."
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'در حال ثبت...' : 'ثبت نظر'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowReviewForm(false);
                setReviewForm({ rating: 5, comment: '' });
              }}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              انصراف
            </button>
          </div>
        </form>
      )}

      {/* لیست نظرات */}
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          <p>هنوز نظری ثبت نشده است</p>
          {isAuthenticated && canReview && (
            <p className="mt-2">اولین نفری باشید که نظر می‌دهد!</p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900">
                      {review.user?.username || review.user_username || 'کاربر'}
                    </span>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString('fa-IR')}
                  </p>
                </div>
                
                {user?.id === review.user?.id && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    نظر شما
                  </span>
                )}
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}

      {!isAuthenticated && (
        <div className="mt-6 text-center bg-blue-50 border border-blue-200 rounded-lg p-6">
          <svg className="w-12 h-12 text-blue-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <p className="text-gray-700 mb-3 font-medium">
            برای ثبت نظر باید وارد حساب کاربری خود شوید
          </p>
          <p className="text-sm text-gray-600 mb-4">
            فقط کاربرانی که این محصول را خریداری کرده‌اند می‌توانند نظر ثبت کنند
          </p>
          <a
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            ورود به حساب کاربری
          </a>
        </div>
      )}

      {isAuthenticated && !canReview && !showReviewForm && reviews.length > 0 && (
        <div className="mt-6 text-center bg-amber-50 border border-amber-200 rounded-lg p-6">
          <svg className="w-12 h-12 text-amber-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-700 font-medium">
            برای ثبت نظر، ابتدا باید این محصول را خریداری کنید
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
