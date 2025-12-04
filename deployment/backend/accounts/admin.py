from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.safestring import mark_safe
from django.urls import reverse
from .models import User, Address


class AddressInline(admin.TabularInline):
    """Inline برای نمایش آدرس‌های کاربر"""
    model = Address
    extra = 0
    fields = ['full_name', 'city', 'province', 'phone_number', 'is_default']
    readonly_fields = ['full_name', 'city', 'province', 'phone_number']
    can_delete = False
    max_num = 0


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    پنل ادمین برای مدل کاربر
    """
    list_display = [
        'username', 'full_name_display', 'email', 'phone_number',
        'orders_count', 'total_spent', 'is_staff', 'date_joined'
    ]
    list_filter = ['is_staff', 'is_superuser', 'is_active', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone_number']
    ordering = ['-date_joined']
    inlines = [AddressInline]
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('اطلاعات اضافی', {
            'fields': ('phone_number', 'national_code', 'birth_date', 'notes')
        }),
        ('آمار و سفارشات', {
            'fields': ('user_orders_summary', 'user_purchase_history'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['user_orders_summary', 'user_purchase_history']
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('اطلاعات اضافی', {
            'fields': ('phone_number', 'national_code', 'birth_date')
        }),
    )
    
    def full_name_display(self, obj):
        """نمایش نام کامل"""
        return obj.get_full_name() or '-'
    full_name_display.short_description = 'نام و نام خانوادگی'
    
    def orders_count(self, obj):
        """تعداد سفارشات کاربر"""
        count = obj.orders.count()
        if count > 0:
            url = reverse('admin:orders_order_changelist') + f'?user__id__exact={obj.id}'
            return mark_safe(f'<a href="{url}">{count} سفارش</a>')
        return '0'
    orders_count.short_description = 'تعداد سفارشات'
    
    def total_spent(self, obj):
        """مجموع خرید کاربر"""
        from django.db.models import Sum
        total = obj.orders.filter(payment_status='paid').aggregate(
            total=Sum('total_price')
        )['total'] or 0
        return f"{total:,} تومان"
    total_spent.short_description = 'مجموع خرید'
    
    def user_orders_summary(self, obj):
        """خلاصه سفارشات کاربر"""
        from django.db.models import Sum, Count
        
        orders = obj.orders.all()
        total_orders = orders.count()
        
        if total_orders == 0:
            return "این کاربر هنوز سفارشی ثبت نکرده است."
        
        paid_orders = orders.filter(payment_status='paid')
        total_spent = paid_orders.aggregate(total=Sum('total_price'))['total'] or 0
        
        status_counts = {}
        for status, label in [
            ('pending', 'در انتظار'),
            ('processing', 'در حال پردازش'),
            ('shipped', 'ارسال شده'),
            ('delivered', 'تحویل داده شده'),
            ('cancelled', 'لغو شده')
        ]:
            count = orders.filter(status=status).count()
            if count > 0:
                status_counts[label] = count
        
        html = '<div style="line-height: 2;">'
        html += f'<p><strong>تعداد کل سفارشات:</strong> {total_orders}</p>'
        html += f'<p><strong>مجموع خرید (پرداخت شده):</strong> {total_spent:,} تومان</p>'
        
        if status_counts:
            html += '<p><strong>وضعیت سفارشات:</strong></p><ul>'
            for status, count in status_counts.items():
                html += f'<li>{status}: {count}</li>'
            html += '</ul>'
        
        url = reverse('admin:orders_order_changelist') + f'?user__id__exact={obj.id}'
        html += f'<p><a href="{url}" class="button">مشاهده همه سفارشات</a></p>'
        html += '</div>'
        
        return mark_safe(html)
    user_orders_summary.short_description = 'خلاصه سفارشات'
    
    def user_purchase_history(self, obj):
        """تاریخچه خرید کاربر با جزئیات"""
        orders = obj.orders.select_related('address').prefetch_related('items__product').order_by('-created_at')[:10]
        
        if not orders:
            return "تاریخچه خریدی وجود ندارد."
        
        html = '<div style="max-height: 500px; overflow-y: auto;">'
        html += '<table style="width:100%; border-collapse: collapse;">'
        html += '<tr style="background-color: #f5f5f5; font-weight: bold; position: sticky; top: 0;">'
        html += '<th style="padding: 8px; border: 1px solid #ddd;">شماره</th>'
        html += '<th style="padding: 8px; border: 1px solid #ddd;">تاریخ</th>'
        html += '<th style="padding: 8px; border: 1px solid #ddd;">اقلام</th>'
        html += '<th style="padding: 8px; border: 1px solid #ddd;">مبلغ</th>'
        html += '<th style="padding: 8px; border: 1px solid #ddd;">وضعیت</th>'
        html += '<th style="padding: 8px; border: 1px solid #ddd;">عملیات</th>'
        html += '</tr>'
        
        for order in orders:
            items_text = "<br/>".join([f"• {item.product.name} × {item.quantity}" for item in order.items.all()[:3]])
            if order.items.count() > 3:
                items_text += f"<br/>... و {order.items.count() - 3} مورد دیگر"
            
            order_url = reverse('admin:orders_order_change', args=[order.id])
            
            html += '<tr>'
            html += f'<td style="padding: 8px; border: 1px solid #ddd;">#{order.id}</td>'
            html += f'<td style="padding: 8px; border: 1px solid #ddd; white-space: nowrap;">{order.created_at.strftime("%Y/%m/%d")}</td>'
            html += f'<td style="padding: 8px; border: 1px solid #ddd;">{items_text}</td>'
            html += f'<td style="padding: 8px; border: 1px solid #ddd; text-align: left;">{order.total_price:,}</td>'
            html += f'<td style="padding: 8px; border: 1px solid #ddd;">{order.get_status_display()}</td>'
            html += f'<td style="padding: 8px; border: 1px solid #ddd;"><a href="{order_url}">مشاهده</a></td>'
            html += '</tr>'
        
        html += '</table>'
        
        if obj.orders.count() > 10:
            url = reverse('admin:orders_order_changelist') + f'?user__id__exact={obj.id}'
            html += f'<p style="margin-top: 10px;"><a href="{url}">مشاهده همه {obj.orders.count()} سفارش</a></p>'
        
        html += '</div>'
        return mark_safe(html)
    user_purchase_history.short_description = 'تاریخچه خرید (10 سفارش اخیر)'


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    """
    پنل ادمین برای مدل آدرس
    """
    list_display = ['full_name', 'user', 'city', 'province', 'phone_number', 'is_default', 'created_at']
    list_filter = ['is_default', 'province', 'created_at']
    search_fields = ['full_name', 'user__username', 'city', 'province', 'postal_code']
    ordering = ['-created_at']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('اطلاعات کاربر', {
            'fields': ('user', 'full_name', 'phone_number')
        }),
        ('اطلاعات آدرس', {
            'fields': ('province', 'city', 'postal_code', 'address_line')
        }),
        ('تنظیمات', {
            'fields': ('is_default', 'created_at')
        }),
    )
