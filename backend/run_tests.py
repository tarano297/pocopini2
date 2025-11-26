#!/usr/bin/env python
"""
اسکریپت اجرای تست‌ها
"""
import os
import sys
import django

# تنظیم محیط Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pokopini.settings')
django.setup()

from django.core.management import call_command

if __name__ == '__main__':
    print("🧪 در حال اجرای تست‌های یکپارچگی...")
    print("=" * 60)
    
    # اجرای تست‌ها
    try:
        call_command('test', verbosity=2)
        print("\n" + "=" * 60)
        print("✅ همه تست‌ها با موفقیت اجرا شدند!")
    except SystemExit as e:
        if e.code != 0:
            print("\n" + "=" * 60)
            print("❌ برخی تست‌ها با خطا مواجه شدند!")
            sys.exit(1)
