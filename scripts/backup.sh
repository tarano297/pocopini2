#!/bin/bash
# اسکریپت بک‌آپ دیتابیس و فایل‌های مدیا

set -e

# بارگذاری متغیرهای محیطی
source backend/.env

# تنظیمات
BACKUP_DIR="backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_BACKUP_FILE="$BACKUP_DIR/db_backup_$DATE.sql"
MEDIA_BACKUP_FILE="$BACKUP_DIR/media_backup_$DATE.tar.gz"

# ایجاد پوشه بک‌آپ
mkdir -p $BACKUP_DIR

echo "🔄 شروع بک‌آپ..."

# بک‌آپ دیتابیس
echo "📊 بک‌آپ دیتابیس..."
PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -U $DB_USER $DB_NAME > $DB_BACKUP_FILE

# بک‌آپ فایل‌های مدیا
echo "📁 بک‌آپ فایل‌های مدیا..."
tar -czf $MEDIA_BACKUP_FILE backend/media/

# حذف بک‌آپ‌های قدیمی (بیش از 30 روز)
echo "🗑️  حذف بک‌آپ‌های قدیمی..."
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "✅ بک‌آپ با موفقیت انجام شد!"
echo "📦 فایل دیتابیس: $DB_BACKUP_FILE"
echo "📦 فایل مدیا: $MEDIA_BACKUP_FILE"
