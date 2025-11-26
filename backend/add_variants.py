import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pokopini.settings')
django.setup()

from products.models import Product, ProductVariant

# دریافت محصول
product = Product.objects.first()

if product:
    print(f"محصول: {product.name}")
    
    # ایجاد چند variant برای این محصول با سایزهای مختلف
    colors = ['red', 'blue', 'pink', 'yellow', 'green']
    sizes = ['newborn', '0-3m', '3-6m', '6-9m', '9-12m', '12-18m', '18-24m', 
             '2y', '3y', '4y', '5y', '6y', '7y', '8y', '9y', '10y', '11y', '12y']
    
    variants_data = []
    for color in colors:
        for size in sizes:
            variants_data.append({
                'color': color,
                'size': size,
                'stock': 10  # موجودی پیش‌فرض
            })
    
    for variant_data in variants_data:
        variant, created = ProductVariant.objects.get_or_create(
            product=product,
            color=variant_data['color'],
            size=variant_data['size'],
            defaults={
                'price': product.price,
                'stock': variant_data['stock'],
                'is_active': True
            }
        )
        if created:
            print(f"✓ ایجاد شد: {variant}")
        else:
            print(f"- قبلاً وجود داشت: {variant}")
    
    print(f"\nتعداد کل variants: {product.variants.count()}")
else:
    print("محصولی یافت نشد!")
