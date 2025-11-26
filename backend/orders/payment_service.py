"""
سرویس پرداخت برای اتصال به درگاه سپ (Shaparak)
"""
import uuid
import hashlib
from django.conf import settings


class PaymentService:
    """
    سرویس پرداخت - برای اتصال به درگاه واقعی، باید API درگاه را پیاده‌سازی کنید
    این یک نمونه ساده است که توکن تصادفی تولید می‌کند
    """
    
    GATEWAY_URL = "https://sep.shaparak.ir/OnlinePG/SendToken"
    
    @staticmethod
    def generate_token(order_id, amount, callback_url):
        """
        تولید توکن پرداخت
        در پیاده‌سازی واقعی، باید به API درگاه متصل شوید
        """
        # تولید توکن تصادفی (در پیاده‌سازی واقعی از API درگاه استفاده کنید)
        token = hashlib.md5(f"{order_id}{amount}{uuid.uuid4()}".encode()).hexdigest()
        return token
    
    @staticmethod
    def get_payment_url(token):
        """
        دریافت URL درگاه پرداخت
        """
        return f"{PaymentService.GATEWAY_URL}?token={token}"
    
    @staticmethod
    def verify_payment(token, ref_id):
        """
        تایید پرداخت
        در پیاده‌سازی واقعی، باید به API درگاه متصل شوید
        """
        # در پیاده‌سازی واقعی، باید پرداخت را با درگاه تایید کنید
        return True

