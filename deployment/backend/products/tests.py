from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Product

User = get_user_model()


class ProductTestCase(APITestCase):
    """تست‌های محصولات"""

    def setUp(self):
        """ایجاد داده‌های تست"""
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

    def test_list_products(self):
        """تست لیست محصولات"""
        url = '/api/products/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)

    def test_filter_products_by_category(self):
        """تست فیلتر محصولات بر اساس دسته"""
        url = '/api/products/?category=baby'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for product in response.data['results']:
            self.assertEqual(product['category'], 'baby')

    def test_search_products(self):
        """تست جستجوی محصولات"""
        url = '/api/products/?search=تست'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
