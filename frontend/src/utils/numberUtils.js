const numberUtils = {
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

  // تبدیل عدد به کلمه فارسی
  toWords: (num) => {
    if (num === 0) return 'صفر';
    
    const ones = [
      '', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه',
      'ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده',
      'هفده', 'هجده', 'نوزده'
    ];
    
    const tens = [
      '', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'
    ];
    
    const hundreds = [
      '', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'
    ];
    
    const scales = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون'];
    
    if (num < 0) {
      return 'منفی ' + numberUtils.toWords(-num);
    }
    
    if (num < 20) {
      return ones[num];
    }
    
    if (num < 100) {
      const ten = Math.floor(num / 10);
      const one = num % 10;
      return tens[ten] + (one > 0 ? ' و ' + ones[one] : '');
    }
    
    if (num < 1000) {
      const hundred = Math.floor(num / 100);
      const remainder = num % 100;
      return hundreds[hundred] + (remainder > 0 ? ' و ' + numberUtils.toWords(remainder) : '');
    }
    
    // برای اعداد بزرگتر از 1000
    let result = '';
    let scaleIndex = 0;
    
    while (num > 0) {
      const chunk = num % 1000;
      if (chunk > 0) {
        const chunkWords = numberUtils.toWords(chunk);
        const scale = scales[scaleIndex];
        result = chunkWords + (scale ? ' ' + scale : '') + (result ? ' و ' + result : '');
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }
    
    return result;
  },

  // فرمت عدد با جداکننده هزارگان
  formatNumber: (num, separator = ',') => {
    if (num === null || num === undefined) return '';
    
    return new Intl.NumberFormat('en-US').format(num).replace(/,/g, separator);
  },

  // فرمت عدد فارسی با جداکننده
  formatPersianNumber: (num, separator = '،') => {
    const formatted = numberUtils.formatNumber(num, separator);
    return numberUtils.toPersianDigits(formatted);
  },

  // تبدیل عدد به درصد
  toPercent: (num, decimals = 1) => {
    if (num === null || num === undefined) return '';
    
    const percent = (num * 100).toFixed(decimals);
    return numberUtils.toPersianDigits(percent) + '%';
  },

  // محاسبه درصد
  calculatePercent: (part, total) => {
    if (!total || total === 0) return 0;
    return (part / total) * 100;
  },

  // گرد کردن عدد
  round: (num, decimals = 0) => {
    if (num === null || num === undefined) return 0;
    
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  },

  // تبدیل عدد به اندازه فایل قابل خواندن
  formatFileSize: (bytes) => {
    if (bytes === 0) return '۰ بایت';
    
    const k = 1024;
    const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت', 'ترابایت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    return numberUtils.toPersianDigits(size) + ' ' + sizes[i];
  },

  // تولید عدد تصادفی
  random: (min = 0, max = 100) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // بررسی اینکه عدد زوج است یا فرد
  isEven: (num) => {
    return num % 2 === 0;
  },

  isOdd: (num) => {
    return num % 2 !== 0;
  },

  // محاسبه میانگین
  average: (numbers) => {
    if (!numbers || numbers.length === 0) return 0;
    
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
  },

  // پیدا کردن حداکثر
  max: (numbers) => {
    if (!numbers || numbers.length === 0) return null;
    return Math.max(...numbers);
  },

  // پیدا کردن حداقل
  min: (numbers) => {
    if (!numbers || numbers.length === 0) return null;
    return Math.min(...numbers);
  },

  // محاسبه مجموع
  sum: (numbers) => {
    if (!numbers || numbers.length === 0) return 0;
    return numbers.reduce((acc, num) => acc + num, 0);
  },

  // اعتبارسنجی عدد
  isValidNumber: (value) => {
    return !isNaN(value) && isFinite(value);
  },

  // تبدیل رشته به عدد
  parseNumber: (str) => {
    if (!str) return 0;
    
    // ابتدا اعداد فارسی را به انگلیسی تبدیل کن
    const englishStr = numberUtils.toEnglishDigits(str);
    
    // حذف کاراکترهای غیرعددی (به جز نقطه و منفی)
    const cleanStr = englishStr.replace(/[^\d.-]/g, '');
    
    const num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : num;
  },

  // فرمت عدد اعشاری
  formatDecimal: (num, decimals = 2) => {
    if (num === null || num === undefined) return '';
    
    const formatted = num.toFixed(decimals);
    return numberUtils.toPersianDigits(formatted);
  },

  // تبدیل عدد به نماد ریاضی
  toMathSymbol: (num) => {
    if (num > 0) return '+' + numberUtils.toPersianDigits(num);
    if (num < 0) return numberUtils.toPersianDigits(num);
    return numberUtils.toPersianDigits(num);
  },

  // محاسبه رشد درصدی
  calculateGrowthRate: (oldValue, newValue) => {
    if (!oldValue || oldValue === 0) return 0;
    
    return ((newValue - oldValue) / oldValue) * 100;
  },

  // فرمت رشد درصدی
  formatGrowthRate: (oldValue, newValue) => {
    const growth = numberUtils.calculateGrowthRate(oldValue, newValue);
    const formatted = numberUtils.formatDecimal(Math.abs(growth), 1);
    
    if (growth > 0) {
      return `+${formatted}%`;
    } else if (growth < 0) {
      return `-${formatted}%`;
    } else {
      return `${formatted}%`;
    }
  },

  // تبدیل عدد به رتبه (اول، دوم، سوم، ...)
  toOrdinal: (num) => {
    const ordinals = [
      '', 'اول', 'دوم', 'سوم', 'چهارم', 'پنجم', 'ششم', 'هفتم', 'هشتم', 'نهم', 'دهم',
      'یازدهم', 'دوازدهم', 'سیزدهم', 'چهاردهم', 'پانزدهم', 'شانزدهم', 'هفدهم', 'هجدهم', 'نوزدهم', 'بیستم'
    ];
    
    if (num <= 20) {
      return ordinals[num];
    }
    
    return numberUtils.toPersianDigits(num) + 'ام';
  },
};

export default numberUtils;