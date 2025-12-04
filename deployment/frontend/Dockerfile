# Dockerfile برای فرانت‌اند React

# مرحله build
FROM node:18-alpine as build

WORKDIR /app

# کپی کردن package files
COPY package*.json ./
RUN npm ci --only=production

# کپی کردن کد منبع
COPY . .

# ساخت پروژه
RUN npm run build

# مرحله production
FROM nginx:alpine

# کپی کردن فایل‌های build شده
COPY --from=build /app/build /usr/share/nginx/html

# کپی کردن تنظیمات nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# پورت
EXPOSE 80

# دستور اجرا
CMD ["nginx", "-g", "daemon off;"]