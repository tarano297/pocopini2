# راهنمای استقرار روی سرور ابری

## فایل‌های موجود در این پوشه

این پوشه شامل تمام فایل‌های ضروری برای استقرار پروژه روی سرور ابری است.

### ساختار پوشه‌ها:
```
deployment/
├── backend/          # کد بک‌اند Django
├── frontend/         # کد فرانت‌اند React
├── scripts/          # اسکریپت‌های دیپلوی و بکاپ
├── docker-compose.yml
├── nginx.conf
├── .env.example
└── README.md
```

## مراحل استقرار

### 1. آماده‌سازی سرور

```bash
# نصب Docker و Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt-get install docker-compose-plugin
```

### 2. آپلود فایل‌ها

```bash
# آپلود پوشه deployment به سرور
scp -r deployment/ user@your-server:/path/to/project/
```

### 3. تنظیمات محیطی

```bash
# کپی و ویرایش فایل‌های .env
cd /path/to/project/deployment
cp .env.example .env
cp backend/.env.example backend/.env

# ویرایش فایل‌های .env با اطلاعات واقعی
nano .env
nano backend/.env
```

### 4. اجرای پروژه

```bash
# ساخت و اجرای کانتینرها
docker-compose up -d --build

# بررسی وضعیت
docker-compose ps
docker-compose logs -f
```

### 5. مایگریشن دیتابیس

```bash
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
docker-compose exec backend python manage.py collectstatic --noinput
```

## نکات مهم

1. **امنیت**: حتماً `SECRET_KEY` و `DEBUG=False` را در production تنظیم کنید
2. **دیتابیس**: از PostgreSQL برای production استفاده کنید
3. **فایل‌های استاتیک**: با nginx سرو می‌شوند
4. **SSL**: برای HTTPS از Let's Encrypt استفاده کنید
5. **بکاپ**: از اسکریپت‌های موجود در پوشه scripts استفاده کنید

## پورت‌ها

- Frontend: 80 (HTTP) / 443 (HTTPS)
- Backend API: 8000
- Admin Panel: /admin

## لاگ‌ها

```bash
# مشاهده لاگ‌ها
docker-compose logs backend
docker-compose logs frontend
docker-compose logs nginx
```

## بکاپ

```bash
# اجرای بکاپ
cd scripts
./backup.sh
```

## پشتیبانی

برای مشکلات و سوالات به فایل‌های راهنمای موجود در پروژه مراجعه کنید.
