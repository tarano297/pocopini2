#!/usr/bin/env python
"""
اسکریپت تولید کد محصول برای محصولات موجود
"""
import os
import django

# تنظیم Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pokopini.settings')
django.setup()

from products.models import Product

def generate_product_codes():
    """تولید کد محصول برای محصولاتی که کد ندارند"""
    products_without_code = Product.objects.filter(product_code__isnull=True)
    count = products_without_code.count()
    
    if count == 0:
        print("✓ همه محصولات دارای کد محصول هستند")
        return
    
    print(f"در حال تولید کد برای {count} محصول...")
    
    for product in products_without_code:
        product.save()  # save method خودکار کد تولید می‌کند
        print(f"✓ کد {product.product_code} برای محصول '{product.name}' تولید شد")
    
    print(f"\n✓ تولید کد برای {count} محصول با موفقیت انجام شد")

if __name__ == '__main__':
    generate_product_codes()
