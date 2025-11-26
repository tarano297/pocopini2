# Dockerfile برای بک‌اند Django

FROM python:3.11-slim

# تنظیم متغیرهای محیطی
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive

# نصب وابستگی‌های سیستم
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        build-essential \
        libpq-dev \
        gettext \
        curl \
    && rm -rf /var/lib/apt/lists/*

# ایجاد کاربر غیر root
RUN adduser --disabled-password --gecos '' appuser

# تنظیم دایرکتوری کاری
WORKDIR /app

# کپی کردن requirements
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# کپی کردن کد پروژه
COPY . /app/

# تنظیم مالکیت فایل‌ها
RUN chown -R appuser:appuser /app
USER appuser

# جمع‌آوری فایل‌های استاتیک
RUN python manage.py collectstatic --noinput

# پورت
EXPOSE 8000

# دستور اجرا
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "pokopini.wsgi:application"]