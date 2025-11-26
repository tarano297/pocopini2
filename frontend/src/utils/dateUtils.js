import moment from 'moment-jalaali';

// تنظیم moment برای استفاده از تقویم جلالی
moment.loadPersian({ usePersianDigits: true, dialect: 'persian-modern' });

const dateUtils = {
  // تبدیل تاریخ میلادی به شمسی
  toJalali: (date, format = 'jYYYY/jMM/jDD') => {
    if (!date) return '';
    return moment(date).format(format);
  },

  // تبدیل تاریخ شمسی به میلادی
  toGregorian: (jalaliDate) => {
    if (!jalaliDate) return null;
    return moment(jalaliDate, 'jYYYY/jMM/jDD').toDate();
  },

  // فرمت تاریخ و زمان کامل
  formatDateTime: (date) => {
    if (!date) return '';
    return moment(date).format('jYYYY/jMM/jDD - HH:mm');
  },

  // فرمت تاریخ فارسی
  formatPersianDate: (date) => {
    if (!date) return '';
    return moment(date).format('jDD jMMMM jYYYY');
  },

  // فرمت زمان
  formatTime: (date) => {
    if (!date) return '';
    return moment(date).format('HH:mm');
  },

  // محاسبه زمان گذشته (مثل "۲ ساعت پیش")
  timeAgo: (date) => {
    if (!date) return '';
    return moment(date).fromNow();
  },

  // محاسبه تفاوت روزها
  daysDifference: (date1, date2) => {
    return moment(date1).diff(moment(date2), 'days');
  },

  // بررسی اینکه آیا تاریخ امروز است
  isToday: (date) => {
    return moment(date).isSame(moment(), 'day');
  },

  // بررسی اینکه آیا تاریخ دیروز است
  isYesterday: (date) => {
    return moment(date).isSame(moment().subtract(1, 'day'), 'day');
  },

  // دریافت تاریخ امروز به فرمت شمسی
  today: (format = 'jYYYY/jMM/jDD') => {
    return moment().format(format);
  },

  // دریافت زمان فعلی
  now: (format = 'jYYYY/jMM/jDD HH:mm:ss') => {
    return moment().format(format);
  },

  // اضافه کردن روز به تاریخ
  addDays: (date, days) => {
    return moment(date).add(days, 'days').toDate();
  },

  // کم کردن روز از تاریخ
  subtractDays: (date, days) => {
    return moment(date).subtract(days, 'days').toDate();
  },

  // دریافت ابتدای روز
  startOfDay: (date) => {
    return moment(date).startOf('day').toDate();
  },

  // دریافت انتهای روز
  endOfDay: (date) => {
    return moment(date).endOf('day').toDate();
  },

  // دریافت ابتدای ماه
  startOfMonth: (date) => {
    return moment(date).startOf('jMonth').toDate();
  },

  // دریافت انتهای ماه
  endOfMonth: (date) => {
    return moment(date).endOf('jMonth').toDate();
  },

  // دریافت نام روز هفته
  getDayName: (date) => {
    const days = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
    return days[moment(date).day()];
  },

  // دریافت نام ماه
  getMonthName: (date) => {
    return moment(date).format('jMMMM');
  },

  // اعتبارسنجی تاریخ شمسی
  isValidJalaliDate: (dateString) => {
    return moment(dateString, 'jYYYY/jMM/jDD', true).isValid();
  },

  // تبدیل timestamp به تاریخ شمسی
  timestampToJalali: (timestamp, format = 'jYYYY/jMM/jDD HH:mm') => {
    return moment(timestamp * 1000).format(format);
  },

  // مقایسه دو تاریخ
  compareDates: (date1, date2) => {
    const m1 = moment(date1);
    const m2 = moment(date2);
    
    if (m1.isBefore(m2)) return -1;
    if (m1.isAfter(m2)) return 1;
    return 0;
  },

  // فرمت تاریخ برای نمایش در فرم‌ها
  formatForInput: (date) => {
    if (!date) return '';
    return moment(date).format('jYYYY-jMM-jDD');
  },

  // پارس کردن تاریخ از فرم
  parseFromInput: (dateString) => {
    if (!dateString) return null;
    return moment(dateString, 'jYYYY-jMM-jDD').toDate();
  },

  // دریافت محدوده تاریخ (مثل هفته گذشته)
  getDateRange: (type) => {
    const now = moment();
    
    switch (type) {
      case 'today':
        return {
          start: now.clone().startOf('day').toDate(),
          end: now.clone().endOf('day').toDate()
        };
      case 'yesterday':
        return {
          start: now.clone().subtract(1, 'day').startOf('day').toDate(),
          end: now.clone().subtract(1, 'day').endOf('day').toDate()
        };
      case 'this_week':
        return {
          start: now.clone().startOf('week').toDate(),
          end: now.clone().endOf('week').toDate()
        };
      case 'last_week':
        return {
          start: now.clone().subtract(1, 'week').startOf('week').toDate(),
          end: now.clone().subtract(1, 'week').endOf('week').toDate()
        };
      case 'this_month':
        return {
          start: now.clone().startOf('jMonth').toDate(),
          end: now.clone().endOf('jMonth').toDate()
        };
      case 'last_month':
        return {
          start: now.clone().subtract(1, 'jMonth').startOf('jMonth').toDate(),
          end: now.clone().subtract(1, 'jMonth').endOf('jMonth').toDate()
        };
      default:
        return {
          start: now.clone().startOf('day').toDate(),
          end: now.clone().endOf('day').toDate()
        };
    }
  },
};

export default dateUtils;