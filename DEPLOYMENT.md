# راهنمای استقرار پوکوپینی

این راهنما مراحل آماده‌سازی و استقرار پروژه پوکوپینی را شرح می‌دهد.

## پیش‌نیازها

- Python 3.10+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Nginx
- دامنه با گواهی SSL

## مراحل استقرار

### 1. تنظیم متغیرهای محیطی

فایل `.env` را در پوشه `backend` ایجاد کنید:

```bash
cp backend/.env.example backend/.env
```

متغیرهای زیر را ویرایش کنید:

```env
SECRET_KEY=your-production-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

DB_ENGINE=django.db.backends.postgresql
DB_NAME=pokopini_db
DB_USER=pokopini_user
DB_PASSWORD=your-secure-password
DB_HOST=localhost
DB_PORT=5432

REDIS_URL=redis://localhost:6379/1

CORS_ALLOWED_ORIGINS=https://yourdomain.com

SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

### 2. نصب وابستگی‌های بک‌اند

```bash
cd backend
pip install -r requirements.txt
```

### 3. پیکربندی PostgreSQL

```bash
# ورود به PostgreSQL
sudo -u postgres psql

# ایجاد دیتابیس و کاربر
CREATE DATABASE pokopini_db;
CREATE USER pokopini_user WITH PASSWORD 'your-secure-password';
ALTER ROLE pokopini_user SET client_encoding TO 'utf8';
ALTER ROLE pokopini_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE pokopini_user SET timezone TO 'Asia/Tehran';
GRANT ALL PRIVILEGES ON DATABASE pokopini_db TO pokopini_user;
\q
```

### 4. اجرای مایگریشن‌ها

```bash
cd backend
python manage.py migrate
python manage.py createsuperuser
```

### 5. جمع‌آوری فایل‌های استاتیک

```bash
python manage.py collectstatic --noinput
```

### 6. Build کردن فرانت‌اند

```bash
cd frontend
npm install
npm run build
```

فایل‌های build شده در پوشه `frontend/build` قرار می‌گیرند.

### 7. پیکربندی Nginx

فایل پیکربندی Nginx را کپی کنید:

```bash
sudo cp nginx.conf /etc/nginx/sites-available/pokopini
sudo ln -s /etc/nginx/sites-available/pokopini /etc/nginx/sites-enabled/
```

فایل را ویرایش کنید و `yourdomain.com` را با دامنه خود جایگزین کنید.

### 8. تنظیم SSL با Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 9. راه‌اندازی Gunicorn با systemd

فایل `/etc/systemd/system/pokopini.service` را ایجاد کنید:

```ini
[Unit]
Description=Pokopini Gunicorn daemon
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/backend
Environment="PATH=/path/to/venv/bin"
EnvironmentFile=/path/to/backend/.env
ExecStart=/path/to/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:8000 pokopini.wsgi:application

[Install]
WantedBy=multi-user.target
```

فعال‌سازی و راه‌اندازی سرویس:

```bash
sudo systemctl daemon-reload
sudo systemctl start pokopini
sudo systemctl enable pokopini
sudo systemctl status pokopini
```

### 10. راه‌اندازی Redis

```bash
sudo systemctl start redis
sudo systemctl enable redis
```

### 11. تست و راه‌اندازی نهایی

```bash
# تست Nginx
sudo nginx -t

# راه‌اندازی مجدد Nginx
sudo systemctl restart nginx

# بررسی لاگ‌ها
sudo journalctl -u pokopini -f
sudo tail -f /var/log/nginx/error.log
```

## استقرار با Docker Compose

برای استقرار ساده‌تر می‌توانید از Docker Compose استفاده کنید:

```bash
# ویرایش docker-compose.yml و تنظیم متغیرها
docker-compose up -d

# اجرای مایگریشن‌ها
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
docker-compose exec backend python manage.py collectstatic --noinput
```

## نکات امنیتی

1. **SECRET_KEY**: حتماً یک کلید تصادفی و قوی استفاده کنید
2. **DEBUG**: در production حتماً `False` باشد
3. **ALLOWED_HOSTS**: فقط دامنه‌های مجاز را اضافه کنید
4. **SSL**: حتماً از HTTPS استفاده کنید
5. **Database**: رمز عبور قوی برای دیتابیس تنظیم کنید
6. **Firewall**: فقط پورت‌های 80 و 443 را باز کنید

## مانیتورینگ و نگهداری

### بررسی لاگ‌ها

```bash
# لاگ‌های Django
sudo journalctl -u pokopini -f

# لاگ‌های Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### بک‌آپ دیتابیس

```bash
# بک‌آپ
pg_dump -U pokopini_user pokopini_db > backup_$(date +%Y%m%d).sql

# بازیابی
psql -U pokopini_user pokopini_db < backup_20241124.sql
```

### به‌روزرسانی

```bash
# Pull کردن تغییرات
git pull origin main

# نصب وابستگی‌های جدید
cd backend && pip install -r requirements.txt
cd ../frontend && npm install

# اجرای مایگریشن‌ها
cd ../backend
python manage.py migrate
python manage.py collectstatic --noinput

# Build فرانت‌اند
cd ../frontend
npm run build

# راه‌اندازی مجدد سرویس‌ها
sudo systemctl restart pokopini
sudo systemctl restart nginx
```

## عیب‌یابی

### خطای 502 Bad Gateway
- بررسی کنید Gunicorn در حال اجرا است: `sudo systemctl status pokopini`
- لاگ‌های Gunicorn را بررسی کنید: `sudo journalctl -u pokopini -f`

### خطای Static Files
- مطمئن شوید `collectstatic` اجرا شده است
- مسیر `STATIC_ROOT` را در Nginx بررسی کنید

### خطای Database Connection
- بررسی کنید PostgreSQL در حال اجرا است
- اطلاعات اتصال در `.env` را بررسی کنید
- دسترسی‌های دیتابیس را چک کنید

## پشتیبانی

برای مشکلات و سوالات، به مستندات Django و Nginx مراجعه کنید.
