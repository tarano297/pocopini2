from rest_framework import permissions
from orders.models import Order, OrderItem


class HasPurchasedProduct(permissions.BasePermission):
    """
    Permission برای بررسی خرید محصول قبل از ثبت نظر
    """
    message = 'شما این محصول را خریداری نکرده‌اید.'

    def has_permission(self, request, view):
        # برای GET اجازه بده
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # برای POST بررسی کن که کاربر احراز هویت شده باشد
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # برای GET اجازه بده
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # برای PUT و DELETE بررسی کن که صاحب نظر باشد
        return obj.user == request.user


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permission برای اطمینان از اینکه فقط صاحب نظر می‌تواند آن را ویرایش یا حذف کند
    """
    def has_object_permission(self, request, view, obj):
        # برای GET اجازه بده
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # برای PUT و DELETE بررسی کن که صاحب نظر باشد
        return obj.user == request.user
