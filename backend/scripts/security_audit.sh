#!/bin/bash
# اسکریپت بررسی امنیتی سیستم

echo "=== بررسی امنیتی پوکوپینی ==="
echo ""

# بررسی permissions فایل‌ها
echo "1. بررسی permissions فایل‌های حساس..."
find . -name "*.py" -perm 777 -ls
find . -name ".env*" -ls

# بررسی SECRET_KEY
echo ""
echo "2. بررسی SECRET_KEY..."
if grep -r "django-insecure" .; then
    echo "⚠️  هشدار: SECRET_KEY پیش‌فرض استفاده شده!"
fi

# بررسی DEBUG mode
echo ""
echo "3. بررسی DEBUG mode..."
if grep -r "DEBUG.*=.*True" backend/pokopini/settings.py; then
    echo "⚠️  هشدار: DEBUG mode فعال است!"
fi

# بررسی dependencies با آسیب‌پذیری
echo ""
echo "4. بررسی آسیب‌پذیری‌های dependencies..."
pip list --outdated

# بررسی SSL certificate
echo ""
echo "5. بررسی SSL certificate..."
if [ -f "cert.pem" ]; then
    openssl x509 -in cert.pem -noout -dates
else
    echo "⚠️  SSL certificate یافت نشد!"
fi

# بررسی log files
echo ""
echo "6. بررسی log های امنیتی..."
if [ -f "backend/logs/security.log" ]; then
    tail -n 20 backend/logs/security.log
fi

echo ""
echo "=== پایان بررسی ==="
