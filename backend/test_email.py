#!/usr/bin/env python
"""
اسکریپت تست ارسال ایمیل
استفاده: python test_email.py
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pokopini.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings
from pokopini.email_utils import send_contact_email


def test_basic_email():
    """تست ارسال ایمیل ساده"""
    print("🔄 در حال ارسال ایمیل تستی...")
    
    try:
        send_mail(
            subject='تست ایمیل - پوکوپینی',
            message='این یک پیام تستی است.\n\nاگر این پیام را دریافت کردید، سیستم ایمیل شما به درستی کار می‌کند! ✅',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.ADMIN_EMAIL],
            fail_silently=False,
        )
        print("✅ ایمیل با موفقیت ارسال شد!")
        print(f"📧 از: {settings.DEFAULT_FROM_EMAIL}")
        print(f"📬 به: {settings.ADMIN_EMAIL}")
        return True
    except Exception as e:
        print(f"❌ خطا در ارسال ایمیل: {str(e)}")
        return False


def test_contact_email():
    """تست ارسال ایمیل تماس با ما"""
    print("\n🔄 در حال تست فرم تماس با ما...")
    
    try:
        success = send_contact_email(
            name="علی احمدی",
            email="test@example.com",
            subject="تست سیستم ایمیل",
            message="این یک پیام تستی از سیستم تماس با ماست.\n\nاگر این پیام را دریافت کردید، همه چیز درست کار می‌کند!"
        )
        
        if success:
            print("✅ ایمیل تماس با ما با موفقیت ارسال شد!")
        else:
            print("❌ خطا در ارسال ایمیل تماس با ما")
        
        return success
    except Exception as e:
        print(f"❌ خطا: {str(e)}")
        return False


def show_config():
    """نمایش تنظیمات فعلی ایمیل"""
    print("\n📋 تنظیمات فعلی ایمیل:")
    print(f"Backend: {settings.EMAIL_BACKEND}")
    print(f"Host: {settings.EMAIL_HOST}")
    print(f"Port: {settings.EMAIL_PORT}")
    print(f"Use TLS: {settings.EMAIL_USE_TLS}")
    print(f"User: {settings.EMAIL_HOST_USER or '(خالی)'}")
    print(f"Password: {'*' * len(settings.EMAIL_HOST_PASSWORD) if settings.EMAIL_HOST_PASSWORD else '(خالی)'}")
    print(f"From: {settings.DEFAULT_FROM_EMAIL}")
    print(f"Admin: {settings.ADMIN_EMAIL}")
    
    if settings.EMAIL_BACKEND == 'django.core.mail.backends.console.EmailBackend':
        print("\n⚠️  توجه: از Console Backend استفاده می‌شود")
        print("   ایمیل‌ها در کنسول نمایش داده می‌شوند، ارسال واقعی نمی‌شوند")
        print("   برای ارسال واقعی، فایل .env را ویرایش کنید")


if __name__ == '__main__':
    print("=" * 60)
    print("🧪 تست سیستم ایمیل پوکوپینی")
    print("=" * 60)
    
    show_config()
    
    print("\n" + "=" * 60)
    test_basic_email()
    
    print("\n" + "=" * 60)
    test_contact_email()
    
    print("\n" + "=" * 60)
    print("✨ تست‌ها تمام شد!")
    print("=" * 60)
