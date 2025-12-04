# اسکریپت‌های استقرار پوکوپینی

این پوشه شامل اسکریپت‌های کمکی برای استقرار و مدیریت پروژه است.

## فایل‌ها

### setup_production.sh
راه‌اندازی اولیه سرور برای محیط production

```bash
sudo bash scripts/setup_production.sh
```

این اسکریپت:
- سیستم را به‌روزرسانی می‌کند
- وابستگی‌های سیستمی را نصب می‌کند (Python, PostgreSQL, Redis, Nginx)
- Node.js را نصب می‌کند
- کاربر اپلیکیشن را ایجاد می‌کند
- دیتابیس PostgreSQL را راه‌اندازی می‌کند
- Firewall را تنظیم می‌کند

### deploy.sh
استقرار نسخه جدید اپلیکیشن

```bash
bash scripts/deploy.sh
```

این اسکریپت:
- آخرین تغییرات را از Git دریافت می‌کند
- وابستگی‌های بک‌اند را نصب می‌کند
- مایگریشن‌ها را اجرا می‌کند
- فایل‌های استاتیک را جمع‌آوری می‌کند
- فرانت‌اند را Build می‌کند
- سرویس‌ها را راه‌اندازی مجدد می‌کند

### backup.sh
بک‌آپ دیتابیس و فایل‌های مدیا

```bash
bash scripts/backup.sh
```

این اسکریپت:
- از دیتابیس PostgreSQL بک‌آپ می‌گیرد
- از فایل‌های مدیا بک‌آپ می‌گیرد
- بک‌آپ‌های قدیمی‌تر از 30 روز را حذف می‌کند

### pokopini.service
فایل systemd service برای Gunicorn

برای استفاده:

```bash
# کپی کردن فایل
sudo cp scripts/pokopini.service /etc/systemd/system/

# ویرایش مسیرها در فایل
sudo nano /etc/systemd/system/pokopini.service

# فعال‌سازی و راه‌اندازی
sudo systemctl daemon-reload
sudo systemctl enable pokopini
sudo systemctl start pokopini
sudo systemctl status pokopini
```

## نکات

1. قبل از اجرای اسکریپت‌ها، مطمئن شوید که دسترسی اجرا دارند:
   ```bash
   chmod +x scripts/*.sh
   ```

2. برای بک‌آپ خودکار، می‌توانید یک cron job تنظیم کنید:
   ```bash
   # ویرایش crontab
   crontab -e
   
   # اضافه کردن بک‌آپ روزانه در ساعت 2 صبح
   0 2 * * * /path/to/pokopini/scripts/backup.sh
   ```

3. برای مانیتورینگ لاگ‌ها:
   ```bash
   # لاگ‌های Gunicorn
   sudo journalctl -u pokopini -f
   
   # لاگ‌های Nginx
   sudo tail -f /var/log/nginx/error.log
   ```
