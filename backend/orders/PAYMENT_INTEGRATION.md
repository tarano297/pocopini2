# راهنمای اتصال به درگاه پرداخت واقعی

## وضعیت فعلی
در حال حاضر، سیستم پرداخت با یک توکن تصادفی کار می‌کند و به درگاه واقعی متصل نیست.

## برای اتصال به درگاه واقعی سپ (Shaparak):

### 1. دریافت اطلاعات درگاه
ابتدا باید از بانک یا ارائه‌دهنده درگاه، اطلاعات زیر را دریافت کنید:
- Terminal ID
- Merchant ID  
- API Key / Secret Key
- URL های API درگاه

### 2. نصب کتابخانه مورد نیاز
```bash
pip install requests
```

### 3. آپدیت فایل `payment_service.py`

```python
import requests
from django.conf import settings

class PaymentService:
    GATEWAY_URL = "https://sep.shaparak.ir/OnlinePG/SendToken"
    VERIFY_URL = "https://sep.shaparak.ir/OnlinePG/Verify"
    
    # اطلاعات درگاه (باید در settings.py قرار گیرد)
    TERMINAL_ID = settings.PAYMENT_TERMINAL_ID
    MERCHANT_ID = settings.PAYMENT_MERCHANT_ID
    API_KEY = settings.PAYMENT_API_KEY
    
    @staticmethod
    def generate_token(order_id, amount, callback_url):
        """
        ارسال درخواست به درگاه برای دریافت توکن
        """
        payload = {
            'TerminalId': PaymentService.TERMINAL_ID,
            'MerchantId': PaymentService.MERCHANT_ID,
            'Amount': amount,
            'OrderId': order_id,
            'CallbackURL': callback_url,
        }
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {PaymentService.API_KEY}'
        }
        
        response = requests.post(
            PaymentService.GATEWAY_URL,
            json=payload,
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            return data.get('token')
        else:
            raise Exception('خطا در دریافت توکن از درگاه')
    
    @staticmethod
    def verify_payment(token, ref_id):
        """
        تایید پرداخت با درگاه
        """
        payload = {
            'TerminalId': PaymentService.TERMINAL_ID,
            'Token': token,
            'RefId': ref_id
        }
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {PaymentService.API_KEY}'
        }
        
        response = requests.post(
            PaymentService.VERIFY_URL,
            json=payload,
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            return data.get('status') == 'success'
        
        return False
```

### 4. اضافه کردن تنظیمات به `settings.py`

```python
# Payment Gateway Settings
PAYMENT_TERMINAL_ID = env('PAYMENT_TERMINAL_ID', default='')
PAYMENT_MERCHANT_ID = env('PAYMENT_MERCHANT_ID', default='')
PAYMENT_API_KEY = env('PAYMENT_API_KEY', default='')
```

### 5. اضافه کردن به `.env`

```
PAYMENT_TERMINAL_ID=your_terminal_id
PAYMENT_MERCHANT_ID=your_merchant_id
PAYMENT_API_KEY=your_api_key
```

## نکات مهم:
1. URL callback باید از خارج قابل دسترسی باشد (نه localhost)
2. برای تست، از sandbox درگاه استفاده کنید
3. مبالغ را به ریال تبدیل کنید (ضرب در 10)
4. لاگ تمام تراکنش‌ها را نگه دارید
5. از HTTPS برای callback استفاده کنید
