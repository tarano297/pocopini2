from django.contrib import admin
from .models import Cart, CartItem, Order, OrderItem


class CartItemInline(admin.TabularInline):
    """Inline برای نمایش آیتم‌های سبد خرید"""
    model = CartItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'subtotal', 'created_at']
    can_delete = False


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    """پنل ادمین برای سبد خرید"""
    list_display = ['user', 'items_count', 'total_price', 'created_at']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['user', 'created_at', 'updated_at', 'total_price', 'items_count']
    inlines = [CartItemInline]
    
    def has_add_permission(self, request):
        return False


class OrderItemInline(admin.TabularInline):
    """Inline برای نمایش آیتم‌های سفارش"""
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'price', 'subtotal']
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """پنل ادمین برای سفارشات"""
    list_display = [
        'id', 'user', 'status', 'total_price',
        'created_at', 'updated_at'
    ]
    list_filter = ['status', 'created_at']
    search_fields = ['user__username', 'user__email', 'id']
    readonly_fields = ['user', 'total_price', 'created_at', 'updated_at']
    list_editable = ['status']
    inlines = [OrderItemInline]
    ordering = ['-created_at']
    
    fieldsets = (
        ('اطلاعات سفارش', {
            'fields': ('user', 'address', 'status', 'total_price')
        }),
        ('تاریخ‌ها', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def has_add_permission(self, request):
        return False
    
    def has_delete_permission(self, request, obj=None):
        # فقط سفارشات در انتظار قابل حذف هستند
        if obj and obj.status != 'pending':
            return False
        return True
