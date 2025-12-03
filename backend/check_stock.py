#!/usr/bin/env python
"""
اسکریپت برای چک کردن موجودی محصولات
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pokopini.settings')
django.setup()

from products.models import Product, ProductVariant

print("=" * 60)
print("بررسی موجودی محصولات")
print("=" * 60)

products = Product.objects.all()
print(f"\nتعداد کل محصولات: {products.count()}")

for product in products[:10]:
    variants = product.variants.all()
    total_stock = sum(v.stock for v in variants)
    print(f"\n📦 {product.name}")
    print(f"   کد محصول: {product.product_code}")
    print(f"   تعداد variants: {variants.count()}")
    print(f"   موجودی کل: {total_stock}")
    print(f"   is_in_stock: {product.is_in_stock}")
    
    if variants.exists():
        print(f"   Variants:")
        for v in variants[:5]:
            print(f"      - {v.get_color_display()} / {v.get_size_display()}: {v.stock} عدد")

print("\n" + "=" * 60)
print("بررسی تمام variants")
print("=" * 60)

all_variants = ProductVariant.objects.all()
print(f"\nتعداد کل variants: {all_variants.count()}")
print(f"Variants با موجودی بیشتر از 0: {all_variants.filter(stock__gt=0).count()}")
print(f"Variants با موجودی 0: {all_variants.filter(stock=0).count()}")
