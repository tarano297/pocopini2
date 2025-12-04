from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem
from products.serializers import ProductListSerializer
import jdatetime


class CartItemSerializer(serializers.ModelSerializer):
    """
    Serializer برای آیتم سبد خرید
    """
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=0, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'subtotal', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("تعداد باید حداقل ۱ باشد.")
        return value

    def validate_product_id(self, value):
        from products.models import Product
        try:
            product = Product.objects.get(id=value, is_active=True)
            if not product.is_in_stock:
                raise serializers.ValidationError("این محصول موجود نیست.")
        except Product.DoesNotExist:
            raise serializers.ValidationError("محصول یافت نشد.")
        return value


class CartSerializer(serializers.ModelSerializer):
    """
    Serializer برای سبد خرید
    """
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=0, read_only=True)
    items_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_price', 'items_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class OrderItemSerializer(serializers.ModelSerializer):
    """
    Serializer برای آیتم سفارش
    """
    product = ProductListSerializer(read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=0, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    """
    Serializer برای سفارش
    """
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    created_at_jalali = serializers.SerializerMethodField(read_only=True)
    updated_at_jalali = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'user_username', 'address', 'status', 'status_display',
            'total_price', 'shipping_method', 'shipping_cost', 'payment_status',
            'payment_ref_id', 'payment_date', 'items', 'created_at', 'created_at_jalali', 
            'updated_at', 'updated_at_jalali'
        ]
        read_only_fields = ['id', 'user', 'total_price', 'created_at', 'updated_at']

    def get_created_at_jalali(self, obj):
        """تبدیل تاریخ ایجاد به شمسی"""
        if obj.created_at:
            jalali_date = jdatetime.datetime.fromgregorian(datetime=obj.created_at)
            return jalali_date.strftime('%Y/%m/%d %H:%M:%S')
        return None

    def get_updated_at_jalali(self, obj):
        """تبدیل تاریخ به‌روزرسانی به شمسی"""
        if obj.updated_at:
            jalali_date = jdatetime.datetime.fromgregorian(datetime=obj.updated_at)
            return jalali_date.strftime('%Y/%m/%d %H:%M:%S')
        return None

    def validate_address(self, value):
        request = self.context.get('request')
        if value and value.user != request.user:
            raise serializers.ValidationError("این آدرس متعلق به شما نیست.")
        return value


class OrderCreateSerializer(serializers.Serializer):
    """
    Serializer برای ایجاد سفارش از سبد خرید
    """
    address_id = serializers.IntegerField()
    shipping_method = serializers.ChoiceField(
        choices=['standard', 'express'],
        default='standard'
    )

    def validate_address_id(self, value):
        from accounts.models import Address
        request = self.context.get('request')
        try:
            address = Address.objects.get(id=value, user=request.user)
        except Address.DoesNotExist:
            raise serializers.ValidationError("آدرس یافت نشد.")
        return value

    def create(self, validated_data):
        from accounts.models import Address
        request = self.context.get('request')
        user = request.user
        address = Address.objects.get(id=validated_data['address_id'])

        # بررسی وجود سبد خرید
        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            raise serializers.ValidationError("سبد خرید خالی است.")

        if not cart.items.exists():
            raise serializers.ValidationError("سبد خرید خالی است.")

        # محاسبه هزینه ارسال
        shipping_method = validated_data.get('shipping_method', 'standard')
        shipping_cost = 50000 if shipping_method == 'express' else 30000
        
        # ایجاد سفارش
        order = Order.objects.create(
            user=user,
            address=address,
            total_price=cart.total_price + shipping_cost,
            shipping_method=shipping_method,
            shipping_cost=shipping_cost
        )

        # کپی کردن آیتم‌های سبد به سفارش
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.product.price
            )
            
            # توجه: کم کردن موجودی باید از طریق ProductVariant انجام شود
            # اگر سیستم variant دارید، باید موجودی variant مربوطه را کم کنید

        # توجه: سبد خرید در فرانت‌اند خالی می‌شود
        # cart.items.all().delete()

        return order
