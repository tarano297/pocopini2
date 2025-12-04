#!/bin/bash
# اسکریپت تولید SSL Certificate و DH Parameters

echo "تولید DH Parameters (این کار ممکنه چند دقیقه طول بکشه)..."
openssl dhparam -out dhparam.pem 4096

echo "تولید Self-Signed SSL Certificate برای تست..."
openssl req -x509 -nodes -days 365 -newkey rsa:4096 \
  -keyout key.pem -out cert.pem \
  -subj "/C=IR/ST=Tehran/L=Tehran/O=Pokopini/CN=pokopini.local"

echo "فایل‌های SSL با موفقیت ایجاد شدند:"
echo "- cert.pem (Certificate)"
echo "- key.pem (Private Key)"
echo "- dhparam.pem (DH Parameters)"
echo ""
echo "توجه: برای production از Let's Encrypt استفاده کنید:"
echo "certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com"
