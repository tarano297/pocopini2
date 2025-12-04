# راهنمای Security Audit

## اجرای بررسی امنیتی

### در Linux/Mac:
```bash
chmod +x backend/scripts/security_audit.sh
./backend/scripts/security_audit.sh
```

### در Windows:
```powershell
powershell -ExecutionPolicy Bypass -File backend/scripts/security_audit.ps1
```

## موارد بررسی شده

### 1. فایل‌های حساس
- بررسی permissions فایل‌های `.env`
- اطمینان از عدم دسترسی عمومی

### 2. SECRET_KEY
- بررسی استفاده از SECRET_KEY سفارشی
- اطمینان از عدم استفاده از کلید پیش‌فرض Django

### 3. DEBUG Mode
- بررسی غیرفعال بودن DEBUG در production
- هشدار در صورت فعال بودن

### 4. Dependencies
- بررسی نسخه‌های قدیمی
- شناسایی آسیب‌پذیری‌های شناخته شده

### 5. SSL Certificate
- بررسی وجود و اعتبار گواهی SSL
- بررسی تاریخ انقضا

### 6. ALLOWED_HOSTS
- بررسی تنظیمات صحیح دامنه‌های مجاز

### 7. CORS Settings
- بررسی محدودیت‌های CORS

## چک‌لیست امنیتی دستی

### قبل از Deploy

- [ ] SECRET_KEY تغییر کرده؟
- [ ] DEBUG = False است؟
- [ ] ALLOWED_HOSTS تنظیم شده؟
- [ ] SSL certificate معتبر است؟
- [ ] فایل‌های .env در .gitignore هستند؟
- [ ] Database backup گرفته شده؟
- [ ] رمزهای پیش‌فرض تغییر کرده‌اند؟

### بعد از Deploy

- [ ] HTTPS فعال است؟
- [ ] Firewall تنظیم شده؟
- [ ] Rate limiting فعال است؟
- [ ] Log monitoring راه‌اندازی شده؟
- [ ] Backup خودکار فعال است؟

## ابزارهای پیشنهادی

### Python Security Tools
```bash
# نصب ابزارهای امنیتی
pip install bandit safety

# اسکن کد با bandit
bandit -r backend/

# بررسی dependencies با safety
safety check
```

### Django Security Check
```bash
cd backend
python manage.py check --deploy
```

## گزارش مشکلات امنیتی

اگر مشکل امنیتی پیدا کردید:

1. فوراً سیستم را از دسترس خارج کنید
2. مشکل را برطرف کنید
3. رمزها و کلیدها را تغییر دهید
4. Log ها را بررسی کنید
5. کاربران را مطلع کنید (در صورت لزوم)

## منابع بیشتر

- [Django Security Best Practices](https://docs.djangoproject.com/en/stable/topics/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Python Security Guide](https://python.readthedocs.io/en/stable/library/security_warnings.html)
