import React, { useState, useEffect } from 'react';

const WelcomePopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // چک کردن اینکه آیا قبلاً پاپ‌آپ نمایش داده شده
    const hasSeenPopup = localStorage.getItem('hasSeenWelcomePopup');
    
    if (!hasSeenPopup) {
      // نمایش پاپ‌آپ بعد از 3 ثانیه
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenWelcomePopup', 'true');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // اینجا می‌تونید ایمیل رو به سرور بفرستید
      console.log('Email submitted:', email);
      setIsSubmitted(true);
      
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Popup */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header با گرادیانت */}
        <div className="bg-gradient-to-r from-coral via-primary to-pastel-purple p-8 text-center">
          <div className="inline-block mb-4 animate-bounce-slow">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-4xl">🎁</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            به پوکوپینی خوش آمدید!
          </h2>
          <p className="text-white/90 text-sm">
            اولین خرید خود را با تخفیف ویژه تجربه کنید
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {!isSubmitted ? (
            <>
              <div className="text-center mb-6">
                <div className="inline-block bg-coral/10 rounded-full px-6 py-3 mb-4">
                  <span className="text-3xl font-bold text-coral">۱۰٪</span>
                  <span className="text-sm text-gray-600 mr-2">تخفیف</span>
                </div>
                <p className="text-gray-600 text-sm">
                  برای دریافت کد تخفیف، ایمیل خود را وارد کنید
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ایمیل شما"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-coral transition-colors text-center"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-coral to-primary text-white py-3 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  دریافت کد تخفیف
                </button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-4">
                با ثبت ایمیل، از جدیدترین محصولات و تخفیف‌ها باخبر می‌شوید
              </p>
            </>
          ) : (
            <div className="text-center py-8 animate-fade-in">
              <div className="inline-block mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                تبریک! 🎉
              </h3>
              <p className="text-gray-600">
                کد تخفیف به ایمیل شما ارسال شد
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
