from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
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
    
    def subtotal(self, obj):
        """نمایش قیمت کل هر آیتم"""
        return f"{obj.subtotal:,} تومان"
    subtotal.short_description = 'جمع کل'


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """پنل ادمین برای سفارشات"""
    list_display = [
        'order_number', 'user_info', 'items_summary', 'total_price_display',
        'payment_status', 'status', 'created_at'
    ]
    list_filter = ['status', 'payment_status', 'shipping_method', 'created_at']
    search_fields = ['id', 'user__username', 'user__email', 'user__phone_number', 
                     'user__first_name', 'user__last_name', 'payment_ref_id']
    readonly_fields = [
        'user', 'user_full_info', 'total_price', 'shipping_cost',
        'created_at', 'updated_at', 'payment_token', 'payment_ref_id',
        'payment_date', 'order_invoice', 'items_detail'
    ]
    list_editable = ['status']
    inlines = [OrderItemInline]
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('اطلاعات کاربر', {
            'fields': ('user', 'user_full_info', 'address')
        }),
        ('اطلاعات سفارش', {
            'fields': ('status', 'total_price', 'shipping_method', 'shipping_cost')
        }),
        ('اطلاعات پرداخت', {
            'fields': ('payment_status', 'payment_ref_id', 'payment_token', 'payment_date')
        }),
        ('فاکتور و جزئیات', {
            'fields': ('order_invoice', 'items_detail'),
            'classes': ('collapse',)
        }),
        ('تاریخ‌ها', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def order_number(self, obj):
        """نمایش شماره سفارش"""
        return f"#{obj.id}"
    order_number.short_description = 'شماره سفارش'
    order_number.admin_order_field = 'id'
    
    def user_info(self, obj):
        """نمایش اطلاعات کاربر"""
        user = obj.user
        info = f"{user.username}"
        if user.first_name or user.last_name:
            info += f" ({user.get_full_name()})"
        if user.phone_number:
            info += f"<br/>{user.phone_number}"
        return mark_safe(info)
    user_info.short_description = 'کاربر'
    
    def user_full_info(self, obj):
        """نمایش اطلاعات کامل کاربر"""
        user = obj.user
        info = f"""
        <div style="line-height: 1.8;">
            <strong>نام کاربری:</strong> {user.username}<br/>
            <strong>نام و نام خانوادگی:</strong> {user.get_full_name() or '-'}<br/>
            <strong>ایمیل:</strong> {user.email or '-'}<br/>
            <strong>شماره تلفن:</strong> {user.phone_number or '-'}<br/>
            <strong>تاریخ عضویت:</strong> {user.created_at.strftime('%Y/%m/%d - %H:%M') if hasattr(user, 'created_at') else '-'}<br/>
            <strong>تعداد سفارشات:</strong> {user.orders.count()}
        </div>
        """
        return mark_safe(info)
    user_full_info.short_description = 'اطلاعات کامل کاربر'
    
    def items_summary(self, obj):
        """خلاصه اقلام سفارش"""
        items = obj.items.all()
        if not items:
            return "-"
        summary = "<br/>".join([f"• {item.product.name} × {item.quantity}" for item in items[:3]])
        if items.count() > 3:
            summary += f"<br/>... و {items.count() - 3} مورد دیگر"
        return mark_safe(summary)
    items_summary.short_description = 'اقلام سفارش'
    
    def items_detail(self, obj):
        """جزئیات کامل اقلام سفارش"""
        items = obj.items.all()
        if not items:
            return "-"
        
        html = '<table style="width:100%; border-collapse: collapse;">'
        html += '<tr style="background-color: #f5f5f5; font-weight: bold;">'
        html += '<th style="padding: 8px; border: 1px solid #ddd;">محصول</th>'
        html += '<th style="padding: 8px; border: 1px solid #ddd;">تعداد</th>'
        html += '<th style="padding: 8px; border: 1px solid #ddd;">قیمت واحد</th>'
        html += '<th style="padding: 8px; border: 1px solid #ddd;">جمع</th>'
        html += '</tr>'
        
        for item in items:
            html += '<tr>'
            html += f'<td style="padding: 8px; border: 1px solid #ddd;">{item.product.name}</td>'
            html += f'<td style="padding: 8px; border: 1px solid #ddd; text-align: center;">{item.quantity}</td>'
            html += f'<td style="padding: 8px; border: 1px solid #ddd; text-align: left;">{item.price:,} تومان</td>'
            html += f'<td style="padding: 8px; border: 1px solid #ddd; text-align: left;">{item.subtotal:,} تومان</td>'
            html += '</tr>'
        
        html += '</table>'
        return mark_safe(html)
    items_detail.short_description = 'جزئیات کامل اقلام'
    
    def total_price_display(self, obj):
        """نمایش قیمت کل با فرمت"""
        return f"{obj.total_price:,} تومان"
    total_price_display.short_description = 'قیمت کل'
    total_price_display.admin_order_field = 'total_price'
    
    def order_invoice(self, obj):
        """نمایش فاکتور سفارش"""
        items = obj.items.all()
        
        html = '<div style="border: 2px solid #333; padding: 20px; max-width: 600px; font-family: Tahoma;">'
        html += '<h2 style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px;">فاکتور سفارش</h2>'
        
        # اطلاعات سفارش
        html += f'<p><strong>شماره سفارش:</strong> #{obj.id}</p>'
        html += f'<p><strong>تاریخ:</strong> {obj.created_at.strftime("%Y/%m/%d - %H:%M")}</p>'
        html += f'<p><strong>وضعیت:</strong> {obj.get_status_display()}</p>'
        html += f'<p><strong>وضعیت پرداخت:</strong> {obj.get_payment_status_display()}</p>'
        
        if obj.payment_ref_id:
            html += f'<p><strong>شماره پیگیری:</strong> {obj.payment_ref_id}</p>'
        
        # اطلاعات خریدار
        html += '<hr/>'
        html += '<h3>اطلاعات خریدار</h3>'
        html += f'<p><strong>نام:</strong> {obj.user.get_full_name() or obj.user.username}</p>'
        html += f'<p><strong>شماره تلفن:</strong> {obj.user.phone_number or "-"}</p>'
        
        if obj.address:
            html += f'<p><strong>آدرس:</strong> {obj.address.province}، {obj.address.city}، {obj.address.address_line}</p>'
            html += f'<p><strong>کد پستی:</strong> {obj.address.postal_code}</p>'
        
        # اقلام سفارش
        html += '<hr/>'
        html += '<h3>اقلام سفارش</h3>'
        html += '<table style="width:100%; border-collapse: collapse;">'
        html += '<tr style="background-color: #f0f0f0;">'
        html += '<th style="padding: 8px; border: 1px solid #ddd; text-align: right;">محصول</th>'
        html += '<th style="padding: 8px; border: 1px solid #ddd; text-align: center;">تعداد</th>'
        html += '<th style="padding: 8px; border: 1px solid #ddd; text-align: left;">قیمت واحد</th>'
        html += '<th style="padding: 8px; border: 1px solid #ddd; text-align: left;">جمع</th>'
        html += '</tr>'
        
        for item in items:
            html += '<tr>'
            html += f'<td style="padding: 8px; border: 1px solid #ddd;">{item.product.name}</td>'
            html += f'<td style="padding: 8px; border: 1px solid #ddd; text-align: center;">{item.quantity}</td>'
            html += f'<td style="padding: 8px; border: 1px solid #ddd; text-align: left;">{item.price:,}</td>'
            html += f'<td style="padding: 8px; border: 1px solid #ddd; text-align: left;">{item.subtotal:,}</td>'
            html += '</tr>'
        
        html += '</table>'
        
        # جمع کل
        html += '<div style="margin-top: 20px; text-align: left;">'
        html += f'<p><strong>هزینه ارسال:</strong> {obj.shipping_cost:,} تومان</p>'
        html += f'<p style="font-size: 18px;"><strong>جمع کل:</strong> {obj.total_price:,} تومان</p>'
        html += '</div>'
        
        html += '</div>'
        return mark_safe(html)
    order_invoice.short_description = 'فاکتور'
    
    def has_add_permission(self, request):
        return False
    
    def has_delete_permission(self, request, obj=None):
        # فقط سفارشات در انتظار قابل حذف هستند
        if obj and obj.status != 'pending':
            return False
        return True
