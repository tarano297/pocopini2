#!/bin/bash
# اسکریپت Backup خودکار با رمزنگاری

BACKUP_DIR="/backups"
DB_NAME="pokopini_db"
DB_USER="pokopini_user"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql.gz"
ENCRYPTED_FILE="$BACKUP_FILE.enc"

# ایجاد پوشه backup
mkdir -p $BACKUP_DIR

# Backup دیتابیس
echo "شروع backup دیتابیس..."
pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_FILE

# رمزنگاری backup
echo "رمزنگاری backup..."
openssl enc -aes-256-cbc -salt -in $BACKUP_FILE -out $ENCRYPTED_FILE -k $BACKUP_ENCRYPTION_KEY

# حذف فایل غیررمزنگاری شده
rm $BACKUP_FILE

# حذف backup های قدیمی (بیشتر از 30 روز)
find $BACKUP_DIR -name "backup_*.sql.gz.enc" -mtime +30 -delete

echo "Backup با موفقیت انجام شد: $ENCRYPTED_FILE"

# ارسال به cloud storage (اختیاری)
# aws s3 cp $ENCRYPTED_FILE s3://your-bucket/backups/
