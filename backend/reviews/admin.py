from django.contrib import admin
from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    """
    پنل ادمین برای مدیریت نظرات
    """
    list_display = ['user', 'product', 'rating', 'created_at']
    list_filter = ['rating', 'created_at', 'product__category']
    search_fields = ['user__username', 'product__name', 'comment']
    readonly_fields = ['user', 'product', 'created_at', 'updated_at']
    ordering = ['-created_at']
    list_per_page = 20
    
    fieldsets = (
        ('اطلاعات نظر', {
            'fields': ('user', 'product', 'rating', 'comment')
        }),
        ('تاریخ‌ها', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def has_add_permission(self, request):
        # نظرات فقط از طریق API قابل ثبت هستند
        return False
    
    def get_queryset(self, request):
        """بهینه‌سازی query"""
        qs = super().get_queryset(request)
        return qs.select_related('user', 'product')
