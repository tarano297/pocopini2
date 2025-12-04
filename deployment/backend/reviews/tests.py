from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from products.models import Product
from orders.models import Order, OrderItem
from accounts.models import Address
from .models import Review

User = get_user_model()


class ReviewTestCase(APITestCase):
    """تست‌های نظرات"""

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
            address_line='آدرس تست'
        )
        
        # ایجاد سفارش (برای تست نظر)
        self.order = Order.objects.create(
            user=self.user,
            address=self.address,
            total_price=100000
        )
        OrderItem.objects.create(
            order=self.order,
            product=self.product,
            quantity=1,
            price=100000
        )
        
        # احراز هویت
        self.client.force_authenticate(user=self.user)

    def test_create_review_after_purchase(self):
        """تست ثبت نظر پس از خرید"""
        url = '/api/reviews/'
        data = {
            'product': self.product.id,
            'rating': 5,
            'comment': 'محصول عالی بود!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # بررسی نظر
        review = Review.objects.get(user=self.user, product=self.product)
        self.assertEqual(review.rating, 5)

    def test_list_product_reviews(self):
        """تست لیست نظرات محصول"""
        # ایجاد نظر
        Review.objects.create(
            user=self.user,
            product=self.product,
            rating=5,
            comment='عالی'
        )
        
        url = f'/api/reviews/?product_id={self.product.id}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)
