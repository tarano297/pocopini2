from django.contrib import admin
from .models import Product, ProductVariant


class ProductVariantInline(admin.TabularInline):
    """
    Inline برای مدیریت تنوع محصولات
    """
    model = ProductVariant
    extra = 1
    fields = ['color', 'size', 'price', 'stock', 'sku', 'is_active']
    readonly_fields = ['sku']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """
    پنل ادمین برای مدیریت محصولات
    """
    list_display = [
        'name', 'category', 'season',
        'price', 'variants_count', 'is_active', 'created_at'
    ]
    list_filter = ['category', 'season', 'is_active', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['is_active', 'price']
    list_per_page = 20
    inlines = [ProductVariantInline]
    
    fieldsets = (
        ('اطلاعات اصلی', {
            'fields': ('name', 'description', 'image')
        }),
        ('دسته‌بندی', {
            'fields': ('category', 'season')
        }),
        ('قیمت پایه', {
            'fields': ('price',),
            'description': 'قیمت پایه محصول - می‌توان برای هر تنوع قیمت جداگانه تعیین کرد'
        }),
        ('وضعیت', {
            'fields': ('is_active', 'created_at', 'updated_at')
        }),
    )
    
    def variants_count(self, obj):
        """تعداد تنوع‌های محصول"""
        return obj.variants.count()
    variants_count.short_description = 'تعداد تنوع'
    
    def get_queryset(self, request):
        """بهینه‌سازی query"""
        qs = super().get_queryset(request)
        return qs.prefetch_related('variants')


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    """
    پنل ادمین برای مدیریت تنوع محصولات
    """
    list_display = [
        'product', 'color', 'size', 'price', 'stock', 'sku', 'is_active'
    ]
    list_filter = ['product__category', 'color', 'size', 'is_active']
    search_fields = ['product__name', 'sku']
    ordering = ['product', 'color', 'size']
    readonly_fields = ['sku', 'created_at']
    list_editable = ['stock', 'price', 'is_active']
    list_per_page = 50
    
    fieldsets = (
        ('محصول', {
            'fields': ('product',)
        }),
        ('مشخصات', {
            'fields': ('color', 'size', 'price', 'stock', 'sku')
        }),
        ('تصویر', {
            'fields': ('image',),
            'description': 'تصویر اختیاری برای این تنوع - در صورت خالی بودن از تصویر محصول اصلی استفاده می‌شود'
        }),
        ('وضعیت', {
            'fields': ('is_active', 'created_at')
        }),
    )
