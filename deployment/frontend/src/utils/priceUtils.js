const priceUtils = {
  // فرمت قیمت به تومان با جداکننده هزارگان
  formatPrice: (price, showCurrency = true) => {
    if (price === null || price === undefined) return '';
    
    // تبدیل به عدد اگر string است
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    if (isNaN(numPrice)) return '';
    
    // فرمت با جداکننده هزارگان
    const formatted = new Intl.NumberFormat('fa-IR').format(numPrice);
    
    return showCurrency ? `${formatted} تومان` : formatted;
  },

  // تبدیل اعداد انگلیسی به فارسی
  toPersianDigits: (num) => {
    if (num === null || num === undefined) return '';
    
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    return num.toString().replace(/\d/g, (digit) => persianDigits[digit]);
  },

  // تبدیل اعداد فارسی به انگلیسی
  toEnglishDigits: (str) => {
    if (!str) return '';
    
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    const englishDigits = '0123456789';
    
    let result = str.toString();
    for (let i = 0; i < persianDigits.length; i++) {
      result = result.replace(new RegExp(persianDigits[i], 'g'), englishDigits[i]);
    }
    
    return result;
  },

  // فرمت قیمت با اعداد فارسی
  formatPersianPrice: (price, showCurrency = true) => {
    const formatted = priceUtils.formatPrice(price, false);
    const persianFormatted = priceUtils.toPersianDigits(formatted);
    
    return showCurrency ? `${persianFormatted} تومان` : persianFormatted;
  },

  // محاسبه تخفیف
  calculateDiscount: (originalPrice, discountPercent) => {
    if (!originalPrice || !discountPercent) return 0;
    
    return Math.round((originalPrice * discountPercent) / 100);
  },

  // محاسبه قیمت نهایی پس از تخفیف
  calculateFinalPrice: (originalPrice, discountPercent) => {
    const discount = priceUtils.calculateDiscount(originalPrice, discountPercent);
    return originalPrice - discount;
  },

  // فرمت قیمت با تخفیف
  formatDiscountedPrice: (originalPrice, discountPercent) => {
    if (!discountPercent || discountPercent === 0) {
      return priceUtils.formatPrice(originalPrice);
    }
    
    const finalPrice = priceUtils.calculateFinalPrice(originalPrice, discountPercent);
    const originalFormatted = priceUtils.formatPrice(originalPrice);
    const finalFormatted = priceUtils.formatPrice(finalPrice);
    
    return {
      original: originalFormatted,
      final: finalFormatted,
      discount: `${discountPercent}%`,
      savings: priceUtils.formatPrice(priceUtils.calculateDiscount(originalPrice, discountPercent))
    };
  },

  // محاسبه مالیات (اگر نیاز باشد)
  calculateTax: (price, taxPercent = 9) => {
    if (!price) return 0;
    return Math.round((price * taxPercent) / 100);
  },

  // محاسبه هزینه ارسال
  calculateShipping: (totalPrice, freeShippingThreshold = 500000) => {
    if (totalPrice >= freeShippingThreshold) {
      return 0;
    }
    
    // هزینه ارسال پیش‌فرض
    return 50000;
  },

  // محاسبه قیمت کل سبد خرید
  calculateCartTotal: (items, shippingCost = 0, taxPercent = 0) => {
    if (!items || items.length === 0) {
      return {
        subtotal: 0,
        tax: 0,
        shipping: shippingCost,
        total: shippingCost
      };
    }
    
    const subtotal = items.reduce((sum, item) => {
      const itemPrice = item.price || item.product?.price || 0;
      const quantity = item.quantity || 1;
      return sum + (itemPrice * quantity);
    }, 0);
    
    const tax = priceUtils.calculateTax(subtotal, taxPercent);
    const shipping = priceUtils.calculateShipping(subtotal);
    const total = subtotal + tax + shipping;
    
    return {
      subtotal,
      tax,
      shipping,
      total
    };
  },

  // فرمت خلاصه قیمت سبد خرید
  formatCartSummary: (cartTotal) => {
    return {
      subtotal: priceUtils.formatPrice(cartTotal.subtotal),
      tax: priceUtils.formatPrice(cartTotal.tax),
      shipping: cartTotal.shipping === 0 ? 'رایگان' : priceUtils.formatPrice(cartTotal.shipping),
      total: priceUtils.formatPrice(cartTotal.total)
    };
  },

  // تبدیل قیمت به واحدهای مختلف
  convertPrice: (price, fromUnit = 'toman', toUnit = 'rial') => {
    if (!price) return 0;
    
    // تبدیل همه چیز به ریال اول
    let priceInRial = price;
    if (fromUnit === 'toman') {
      priceInRial = price * 10;
    }
    
    // سپس تبدیل به واحد مقصد
    if (toUnit === 'toman') {
      return priceInRial / 10;
    }
    
    return priceInRial;
  },

  // مقایسه قیمت‌ها
  comparePrices: (price1, price2) => {
    const p1 = typeof price1 === 'string' ? parseFloat(price1) : price1;
    const p2 = typeof price2 === 'string' ? parseFloat(price2) : price2;
    
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
    return 0;
  },

  // اعتبارسنجی قیمت
  isValidPrice: (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return !isNaN(numPrice) && numPrice >= 0;
  },

  // گرد کردن قیمت
  roundPrice: (price, precision = 0) => {
    if (!priceUtils.isValidPrice(price)) return 0;
    
    const factor = Math.pow(10, precision);
    return Math.round(price * factor) / factor;
  },

  // محاسبه درصد تخفیف
  calculateDiscountPercent: (originalPrice, salePrice) => {
    if (!originalPrice || !salePrice || originalPrice <= salePrice) return 0;
    
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  },

  // فرمت محدوده قیمت
  formatPriceRange: (minPrice, maxPrice) => {
    if (!minPrice && !maxPrice) return '';
    if (!maxPrice) return `از ${priceUtils.formatPrice(minPrice)}`;
    if (!minPrice) return `تا ${priceUtils.formatPrice(maxPrice)}`;
    
    return `${priceUtils.formatPrice(minPrice)} - ${priceUtils.formatPrice(maxPrice)}`;
  },
};

export default priceUtils;