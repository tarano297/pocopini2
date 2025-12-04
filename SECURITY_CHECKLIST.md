# 🔒 چک‌لیست امنیتی پوکوپینی

## ✅ تنظیمات انجام شده

### 1. امنیت Django Backend
- ✅ استفاده از Argon2 برای هش کردن پسورد
- ✅ محافظت در برابر Brute Force با Django Axes
- ✅ Rate Limiting برای API ها
- ✅ محافظت در برابر SQL Injection
- ✅ محافظت در برابر XSS و CSRF
- ✅ Content Security Policy (CSP)
- ✅ Session Security با timeout کوتاه
- ✅ JWT با Refresh Token Rotation
- ✅ IP Whitelist برای پنل ادمین
- ✅ API Key Authentication برای عملیات حساس

### 2. امنیت Nginx
- ✅ فقط TLS 1.3 فعال
- ✅ بهترین Cipher Suites
-  HSTS با preload
-  تمام Security Headers
-  Rate Limiting در سطح Nginx
-  محافظت در برابر DDoS و Slowloris
-  مخفی کردن نسخه Nginx

### 3. امنیت Database
-  استفاده از PostgreSQL
-  پسوردهای قوی
-  دسترسی محدود به شبکه داخلی

### 4. Logging و Monitoring
-  لاگ تمام تلاش‌های ناموفق ورود
-  لاگ درخواست‌های مشکوک
-  لاگ تلاش‌های دسترسی غیرمجاز

##  کارهایی که باید انجام بدی

### فوری (قبل از Production)
- [ ] SECRET_KEY رو تغییر بده و در جای امن نگه دار
- [ ] DEBUG=False تنظیم کن
- [ ] ALLOWED_HOSTS رو به دامنه واقعی تغییر بده
- [ ] پسورد دیتابیس رو تغییر بده
- [ ] SSL Certificate واقعی از Let's Encrypt بگیر
- [ ] ADMIN_URL رو به یه مسیر تصادفی تغییر بده
- [ ] ADMIN_IP_WHITELIST رو تنظیم کن
- [ ] API Keys تولید کن و در .env ذخیره کن

### مهم
- [ ] Backup خودکار دیتابیس تنظیم کن
- [ ] Monitoring با Sentry یا مشابه
- [ ] Firewall سرور رو تنظیم کن (فقط پورت 80, 443)
- [ ] SSH با Key-based authentication
- [ ] Fail2ban نصب و تنظیم کن
- [ ] بررسی منظم لاگ‌ها

### پیشنهادی
- [ ] WAF (Web Application Firewall) مثل Cloudflare
- [ ] CDN برای محتوای استاتیک
- [ ] Two-Factor Authentication (2FA) برای ادمین
- [ ] Security Audit منظم
- [ ] Penetration Testing
- [ ] Bug Bounty Program

##  دستورات مفید

### تولید SECRET_KEY جدید
\\\python
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
\\\

### تولید API Key
\\\python
python -c 'import secrets; print(secrets.token_urlsafe(32))'
\\\

### دریافت SSL Certificate از Let's Encrypt
\\\ash
certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
\\\

### تست امنیت SSL
\\\ash
# بعد از راه‌اندازی سایت
https://www.ssllabs.com/ssltest/
\\\

### بررسی Security Headers
\\\ash
curl -I https://yourdomain.com
\\\

##  در صورت حمله

1. بلافاصله سرور رو از اینترنت جدا کن
2. لاگ‌ها رو بررسی کن
3. پسوردها و کلیدها رو تغییر بده
4. از backup بازگردانی کن
5. آسیب‌پذیری رو پیدا و رفع کن
6. سیستم رو با آخرین آپدیت‌ها راه‌اندازی کن

##  منابع مفید

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Django Security: https://docs.djangoproject.com/en/stable/topics/security/
- Mozilla SSL Config: https://ssl-config.mozilla.org/
- Security Headers: https://securityheaders.com/

##  بروزرسانی منظم

- [ ] هفتگی: بررسی لاگ‌های امنیتی
- [ ] ماهانه: آپدیت پکیج‌ها و dependencies
- [ ] سه‌ماهه: Security Audit
- [ ] سالانه: Penetration Testing
