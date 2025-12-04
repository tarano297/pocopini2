# بهینه‌سازی‌های مربوط به محصولات

from django.db import models
from django.core.cache import cache
from django.db.models import Prefetch, Count, Avg
from .models import Product, Review

class OptimizedProductQuerySet(models.QuerySet):
    """QuerySet بهینه‌سازی شده برای محصولات"""
    
    def with_reviews(self):
        """بارگذاری محصولات همراه با نظرات"""
        return self.prefetch_related(
            Prefetch(
                'reviews',
                queryset=Review.objects.select_related('user').order_by('-created_at')
            )
        )
    
    def with_stats(self):
        """بارگذاری محصولات همراه با آمار"""
        return self.annotate(
            review_count=Count('reviews'),
            average_rating=Avg('reviews__rating')
        )
    
    def active_products(self):
        """فقط محصولات فعال"""
        return self.filter(is_active=True, stock__gt=0)
    
    def by_category(self, category):
        """فیلتر بر اساس دسته‌بندی"""
        return self.filter(category=category)
    
    def by_season(self, season):
        """فیلتر بر اساس فصل"""
        return self.filter(season=season)
    
    def search(self, query):
        """جستجو در نام و توضیحات"""
        return self.filter(
            models.Q(name__icontains=query) |
            models.Q(description__icontains=query)
        )
    
    def featured(self):
        """محصولات ویژه (بر اساس فروش و امتیاز)"""
        return self.with_stats().filter(
            is_active=True,
            stock__gt=0
        ).order_by('-average_rating', '-review_count')[:8]

class ProductCacheManager:
    """مدیریت cache برای محصولات"""
    
    CACHE_TIMEOUT = 300  # 5 minutes
    
    @staticmethod
    def get_featured_products():
        """دریافت محصولات ویژه از cache"""
        cache_key = 'featured_products'
        products = cache.get(cache_key)
        
        if products is None:
            products = list(
                Product.objects.with_stats()
                .active_products()
                .featured()
            )
            cache.set(cache_key, products, ProductCacheManager.CACHE_TIMEOUT)
        
        return products
    
    @staticmethod
    def get_category_products(category, page=1, page_size=12):
        """دریافت محصولات دسته‌بندی از cache"""
        cache_key = f'category_products_{category}_{page}_{page_size}'
        products = cache.get(cache_key)
        
        if products is None:
            start = (page - 1) * page_size
            end = start + page_size
            
            products = list(
                Product.objects.with_stats()
                .active_products()
                .by_category(category)
                .order_by('-created_at')[start:end]
            )
            cache.set(cache_key, products, ProductCacheManager.CACHE_TIMEOUT)
        
        return products
    
    @staticmethod
    def invalidate_product_cache(product_id=None):
        """پاک کردن cache محصولات"""
        cache_keys = [
            'featured_products',
            f'product_detail_{product_id}' if product_id else None,
        ]
        
        # پاک کردن cache دسته‌بندی‌ها
        for category in ['baby', 'girl', 'boy']:
            for page in range(1, 6):  # فرض 5 صفحه اول
                cache_keys.append(f'category_products_{category}_{page}_12')
        
        cache.delete_many([key for key in cache_keys if key])

# Middleware برای cache headers
class CacheControlMiddleware:
    """Middleware برای تنظیم cache headers"""
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        
        # تنظیم cache headers برای API های محصولات
        if request.path.startswith('/api/products/'):
            if request.method == 'GET':
                response['Cache-Control'] = 'public, max-age=300'  # 5 minutes
            else:
                response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        
        return response

# Database indexes برای بهینه‌سازی
"""
در models.py اضافه کنید:

class Product(models.Model):
    # ... fields ...
    
    class Meta:
        indexes = [
            models.Index(fields=['category', 'is_active']),
            models.Index(fields=['season', 'is_active']),
            models.Index(fields=['created_at']),
            models.Index(fields=['price']),
            models.Index(fields=['stock']),
        ]
        
class Review(models.Model):
    # ... fields ...
    
    class Meta:
        indexes = [
            models.Index(fields=['product', 'created_at']),
            models.Index(fields=['rating']),
        ]
"""