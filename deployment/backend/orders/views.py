from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Cart, CartItem, Order
from .serializers import (
    CartSerializer, CartItemSerializer,
    OrderSerializer, OrderCreateSerializer
)
from .payment_service import PaymentService


class CartViewSet(viewsets.ViewSet):
    """
    ViewSet برای مدیریت سبد خرید
    """
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """نمایش سبد خرید کاربر با بهینه‌سازی"""
        cart, created = Cart.objects.prefetch_related('items__product').get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add(self, request):
        """افزودن محصول به سبد خرید"""
        cart, created = Cart.objects.get_or_create(user=request.user)
        
        serializer = CartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        product_id = serializer.validated_data['product_id']
        quantity = serializer.validated_data.get('quantity', 1)
        
        # بررسی وجود محصول در سبد
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product_id=product_id,
            defaults={'quantity': quantity}
        )
        
        if not created:
            # اگر محصول قبلاً در سبد بود، تعداد را افزایش بده
            cart_item.quantity += quantity
            cart_item.save()
        
        return Response({
            'message': 'محصول به سبد خرید اضافه شد.',
            'cart': CartSerializer(cart).data
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['put'], url_path='update/(?P<item_id>[^/.]+)')
    def update_item(self, request, item_id=None):
        """به‌روزرسانی تعداد محصول در سبد"""
        try:
            cart = Cart.objects.get(user=request.user)
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
        except (Cart.DoesNotExist, CartItem.DoesNotExist):
            return Response({
                'error': 'آیتم یافت نشد.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        quantity = request.data.get('quantity')
        if not quantity or int(quantity) < 1:
            return Response({
                'error': 'تعداد باید حداقل ۱ باشد.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        cart_item.quantity = int(quantity)
        cart_item.save()
        
        return Response({
            'message': 'تعداد محصول به‌روزرسانی شد.',
            'cart': CartSerializer(cart).data
        })

    @action(detail=False, methods=['delete'], url_path='remove/(?P<item_id>[^/.]+)')
    def remove_item(self, request, item_id=None):
        """حذف محصول از سبد"""
        try:
            cart = Cart.objects.get(user=request.user)
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
        except (Cart.DoesNotExist, CartItem.DoesNotExist):
            return Response({
                'error': 'آیتم یافت نشد.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        cart_item.delete()
        
        return Response({
            'message': 'محصول از سبد خرید حذف شد.',
            'cart': CartSerializer(cart).data
        })

    @action(detail=False, methods=['delete'])
    def clear(self, request):
        """خالی کردن سبد خرید"""
        try:
            cart = Cart.objects.get(user=request.user)
            cart.items.all().delete()
        except Cart.DoesNotExist:
            pass
        
        return Response({
            'message': 'سبد خرید خالی شد.'
        })


class OrderViewSet(viewsets.ModelViewSet):
    """
    ViewSet برای مدیریت سفارشات
    - کاربران عادی: فقط سفارشات خودشان
    - ادمین: همه سفارشات + امکان تغییر وضعیت
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        برای ادمین همه سفارشات، برای کاربران عادی فقط سفارشات خودشان
        با بهینه‌سازی برای کاهش تعداد queries
        """
        queryset = Order.objects.select_related('user', 'address').prefetch_related('items__product')
        
        if self.request.user.is_staff:
            return queryset
        return queryset.filter(user=self.request.user)

    def create(self, request):
        """ثبت سفارش جدید از سبد خرید"""
        serializer = OrderCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        return Response({
            'message': 'سفارش با موفقیت ثبت شد.',
            'order': OrderSerializer(order).data
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'], url_path='payment-token')
    def create_payment_token(self, request, pk=None):
        """ایجاد توکن پرداخت برای سفارش"""
        print(f"Creating payment token for order {pk}")
        order = self.get_object()
        print(f"Order found: {order.id}, User: {order.user.username}")
        
        # بررسی اینکه سفارش متعلق به کاربر فعلی است
        if order.user != request.user and not request.user.is_staff:
            print(f"Permission denied: order user {order.user.id} != request user {request.user.id}")
            return Response({
                'error': 'شما مجاز به دسترسی به این سفارش نیستید.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # بررسی اینکه سفارش قبلاً پرداخت نشده باشد
        if order.payment_status == 'paid':
            print(f"Order already paid")
            return Response({
                'error': 'این سفارش قبلاً پرداخت شده است.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # ایجاد توکن پرداخت
        callback_url = request.build_absolute_uri('/api/orders/payment-callback/')
        print(f"Callback URL: {callback_url}")
        
        token = PaymentService.generate_token(
            order_id=order.id,
            amount=int(order.total_price),
            callback_url=callback_url
        )
        print(f"Token generated: {token}")
        
        # ذخیره توکن در سفارش
        order.payment_token = token
        order.save()
        
        # دریافت URL درگاه پرداخت
        payment_url = PaymentService.get_payment_url(token)
        print(f"Payment URL: {payment_url}")
        
        return Response({
            'token': token,
            'payment_url': payment_url,
            'amount': order.total_price
        })
    
    @action(detail=False, methods=['post'], url_path='payment-callback')
    def payment_callback(self, request):
        """دریافت نتیجه پرداخت از درگاه"""
        token = request.data.get('token')
        ref_id = request.data.get('ref_id')
        status_code = request.data.get('status')
        
        if not token:
            return Response({
                'error': 'توکن پرداخت ارسال نشده است.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            order = Order.objects.get(payment_token=token)
        except Order.DoesNotExist:
            return Response({
                'error': 'سفارش یافت نشد.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # بررسی وضعیت پرداخت
        if status_code == 'success':
            # تایید پرداخت با درگاه
            is_verified = PaymentService.verify_payment(token, ref_id)
            
            if is_verified:
                order.payment_status = 'paid'
                order.payment_ref_id = ref_id
                order.payment_date = timezone.now()
                order.status = 'processing'
                order.save()
                
                return Response({
                    'message': 'پرداخت با موفقیت انجام شد.',
                    'order_id': order.id,
                    'ref_id': ref_id
                })
            else:
                order.payment_status = 'failed'
                order.save()
                return Response({
                    'error': 'تایید پرداخت با خطا مواجه شد.'
                }, status=status.HTTP_400_BAD_REQUEST)
        else:
            order.payment_status = 'failed'
            order.save()
            return Response({
                'error': 'پرداخت ناموفق بود.'
            }, status=status.HTTP_400_BAD_REQUEST)
