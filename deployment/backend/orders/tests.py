from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from products.models import Product
from accounts.models import Address
from .models import Cart, CartItem, Order

User = get_user_model()


class OrderFlowTestCase(APITestCase):
    """تست‌های جریان سفارش (خرید)"""

    def setUp(self):
        """ایجاد داده‌های تست"""
        # ایجاد کاربر
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        # ایجاد محصول
        self.product = Product.objects.create(
            name='تست محصول',
            description='توضیحات تست',
            price=100000,
            category='baby',
            season='spring',
            color='آبی',
            size='M',
            stock=10
        )
        
        # ایجاد آدرس
        self.address = Address.objects.create(
            user=self.user,
            full_name='کاربر تست',
            phone_number='09123456789',
            province='تهران',
            city='تهران',
            postal_code='1234567890',
            address_line='آدرس تست',
            is_default=True
        )
        
        # احراز هویت
        self.client.force_authenticate(user=self.user)

    def test_add_to_cart(self):
        """تست افزودن به سبد خرید"""
        url = '/api/cart/add/'
        data = {
            'product_id': self.product.id,
            'quantity': 2
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # بررسی سبد خرید
        cart = Cart.objects.get(user=self.user)
        self.assertEqual(cart.items.count(), 1)
        self.assertEqual(cart.items.first().quantity, 2)

    def test_complete_purchase_flow(self):
        """تست جریان کامل خرید"""
        # 1. افزودن به سبد
        url = '/api/cart/add/'
        data = {'product_id': self.product.id, 'quantity': 1}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # 2. مشاهده سبد
        url = '/api/cart/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # 3. ثبت سفارش
        url = '/api/orders/'
        data = {'address_id': self.address.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # بررسی سفارش
        order = Order.objects.get(user=self.user)
        self.assertEqual(order.items.count(), 1)
        self.assertEqual(order.status, 'pending')
