#!/bin/bash
# اسکریپت راه‌اندازی اولیه محیط production

set -e

echo "🚀 راه‌اندازی محیط Production..."

# بررسی دسترسی root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ لطفاً این اسکریپت را با sudo اجرا کنید"
    exit 1
fi

# به‌روزرسانی سیستم
echo "📦 به‌روزرسانی سیستم..."
apt update && apt upgrade -y

# نصب وابستگی‌های سیستمی
echo "📦 نصب وابستگی‌های سیستمی..."
apt install -y python3 python3-pip python3-venv postgresql postgresql-contrib redis-server nginx git

# نصب Node.js
echo "📦 نصب Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# ایجاد کاربر برای اپلیکیشن
echo "👤 ایجاد کاربر اپلیکیشن..."
if ! id "pokopini" &>/dev/null; then
    useradd -m -s /bin/bash pokopini
fi

# تنظیم PostgreSQL
echo "🗄️  تنظیم PostgreSQL..."
sudo -u postgres psql -c "CREATE DATABASE pokopini_db;" || true
sudo -u postgres psql -c "CREATE USER pokopini_user WITH PASSWORD 'change-this-password';" || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE pokopini_db TO pokopini_user;" || true

# فعال‌سازی Redis
echo "🔴 فعال‌سازی Redis..."
systemctl enable redis-server
systemctl start redis-server

# تنظیم Firewall
echo "🔥 تنظیم Firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# ایجاد پوشه‌های مورد نیاز
echo "📁 ایجاد پوشه‌های مورد نیاز..."
mkdir -p /var/www/pokopini
chown -R pokopini:pokopini /var/www/pokopini

echo "✅ راه‌اندازی اولیه با موفقیت انجام شد!"
echo ""
echo "⚠️  مراحل بعدی:"
echo "1. کد پروژه را در /var/www/pokopini کلون کنید"
echo "2. فایل .env را در backend ایجاد و تنظیم کنید"
echo "3. Virtual environment ایجاد کنید"
echo "4. وابستگی‌های Python را نصب کنید"
echo "5. مایگریشن‌ها را اجرا کنید"
echo "6. Gunicorn service را تنظیم کنید"
echo "7. Nginx را پیکربندی کنید"
echo "8. SSL را با certbot تنظیم کنید"
