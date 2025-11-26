from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Address


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    پنل ادمین برای مدل کاربر
    """
    list_display = ['username', 'email', 'first_name', 'last_name', 'phone_number', 'is_staff', 'date_joined']
    list_filter = ['is_staff', 'is_superuser', 'is_active', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone_number']
    ordering = ['-date_joined']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('اطلاعات اضافی', {'fields': ('phone_number',)}),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('اطلاعات اضافی', {'fields': ('phone_number',)}),
    )


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
