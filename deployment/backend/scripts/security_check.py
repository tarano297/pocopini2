#!/usr/bin/env python
# اسکریپت بررسی امنیتی و آسیب‌پذیری‌ها

import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pokopini.settings')
django.setup()

from django.conf import settings
from django.core.management import call_command

def check_security():
    print('🔍 بررسی تنظیمات امنیتی...\n')
    
    issues = []
    warnings = []
    
    # بررسی DEBUG
    if settings.DEBUG:
        issues.append('❌ DEBUG=True در production خطرناک است!')
    else:
        print('✅ DEBUG غیرفعال است')
    
    # بررسی SECRET_KEY
    if settings.SECRET_KEY == 'django-insecure-jw8$o6@zbi=(=1qd20mj4q78v8=z81&wjr)ee_uqo(x-oi(ig)':
        issues.append('❌ SECRET_KEY پیش‌فرض است! حتماً تغییر دهید')
    else:
        print('✅ SECRET_KEY سفارشی است')
    
    # بررسی ALLOWED_HOSTS
    if '*' in settings.ALLOWED_HOSTS:
        issues.append(' ALLOWED_HOSTS شامل * است!')
    elif settings.ALLOWED_HOSTS:
        print(f' ALLOWED_HOSTS: {settings.ALLOWED_HOSTS}')
    else:
        warnings.append('  ALLOWED_HOSTS خالی است')
    
    # بررسی HTTPS
    if not settings.DEBUG:
        if not settings.SECURE_SSL_REDIRECT:
            warnings.append('  SECURE_SSL_REDIRECT غیرفعال است')
        else:
            print(' HTTPS redirect فعال است')
        
        if not settings.SESSION_COOKIE_SECURE:
            warnings.append('  SESSION_COOKIE_SECURE غیرفعال است')
        else:
            print(' Session cookies امن هستند')
    
    # بررسی Password Hashers
    if 'Argon2PasswordHasher' in settings.PASSWORD_HASHERS[0]:
        print(' از Argon2 برای hash کردن پسورد استفاده می‌شود')
    else:
        warnings.append('  Argon2 اولین hasher نیست')
    
    # بررسی CORS
    if hasattr(settings, 'CORS_ALLOW_ALL_ORIGINS') and settings.CORS_ALLOW_ALL_ORIGINS:
        issues.append(' CORS_ALLOW_ALL_ORIGINS=True خطرناک است!')
    else:
        print(' CORS به درستی پیکربندی شده')
    
    # بررسی Rate Limiting
    if hasattr(settings, 'RATELIMIT_ENABLE') and settings.RATELIMIT_ENABLE:
        print(' Rate limiting فعال است')
    else:
        warnings.append('  Rate limiting غیرفعال است')
    
    # بررسی Django Axes
    if 'axes' in settings.INSTALLED_APPS:
        print(' Django Axes (محافظت brute force) نصب است')
    else:
        warnings.append('  Django Axes نصب نیست')
    
    # نمایش نتایج
    print('\n' + '='*50)
    
    if issues:
        print('\n مشکلات جدی:')
        for issue in issues:
            print(f'  {issue}')
    
    if warnings:
        print('\n  هشدارها:')
        for warning in warnings:
            print(f'  {warning}')
    
    if not issues and not warnings:
        print('\n همه چیز عالی است!')
    
    print('\n' + '='*50)
    
    # اجرای check امنیتی Django
    print('\n اجرای Django Security Check...\n')
    call_command('check', '--deploy')

if __name__ == '__main__':
    check_security()
