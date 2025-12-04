"""
Custom Security Middleware for Pokopini
"""
import logging
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from django.core.cache import cache
from django.conf import settings
import hashlib

logger = logging.getLogger(__name__)


class SecurityHeadersMiddleware(MiddlewareMixin):
    """
    اضافه کردن هدرهای امنیتی اضافی
    """
    def process_response(self, request, response):
        # Permissions Policy (Feature Policy)
        response['Permissions-Policy'] = (
            'geolocation=(), '
            'microphone=(), '
            'camera=(), '
            'payment=(), '
            'usb=(), '
            'magnetometer=(), '
            'gyroscope=(), '
            'accelerometer=()'
        )
        
        # Additional security headers
        response['X-Permitted-Cross-Domain-Policies'] = 'none'
        response['Cross-Origin-Embedder-Policy'] = 'require-corp'
        response['Cross-Origin-Opener-Policy'] = 'same-origin'
        response['Cross-Origin-Resource-Policy'] = 'same-origin'
        
        return response


class RateLimitMiddleware(MiddlewareMixin):
    """
    محدودیت تعداد درخواست برای جلوگیری از حملات DDoS
    """
    def process_request(self, request):
        if not settings.RATELIMIT_ENABLE:
            return None
        
        # Skip rate limiting for static files
        if request.path.startswith('/static/') or request.path.startswith('/media/'):
            return None
        
        # Get client IP
        ip = self.get_client_ip(request)
        
        # Different limits for different endpoints
        if request.path.startswith('/api/auth/login/'):
            limit = 5
            period = 300  # 5 minutes
        elif request.path.startswith('/api/auth/register/'):
            limit = 3
            period = 3600  # 1 hour
        elif request.path.startswith('/api/'):
            limit = 100
            period = 60  # 1 minute
        else:
            return None
        
        # Create cache key
        cache_key = f'ratelimit:{ip}:{request.path}'
        
        # Get current count
        count = cache.get(cache_key, 0)
        
        if count >= limit:
            logger.warning(f'Rate limit exceeded for IP {ip} on {request.path}')
            return JsonResponse({
                'error': 'تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً بعداً تلاش کنید.',
                'detail': 'Rate limit exceeded'
            }, status=429)
        
        # Increment count
        cache.set(cache_key, count + 1, period)
        
        return None
    
    def get_client_ip(self, request):
        """دریافت IP واقعی کلاینت"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class RequestValidationMiddleware(MiddlewareMixin):
    """
    اعتبارسنجی درخواست‌ها برای جلوگیری از حملات
    """
    SUSPICIOUS_PATTERNS = [
        '<script', 'javascript:', 'onerror=', 'onload=',
        '../', '..\\', 'union select', 'drop table',
        'exec(', 'eval(', '__import__'
    ]
    
    def process_request(self, request):
        # Check for suspicious patterns in query parameters
        query_string = request.META.get('QUERY_STRING', '').lower()
        
        for pattern in self.SUSPICIOUS_PATTERNS:
            if pattern in query_string:
                logger.warning(
                    f'Suspicious pattern detected: {pattern} '
                    f'from IP {self.get_client_ip(request)}'
                )
                return JsonResponse({
                    'error': 'درخواست نامعتبر',
                    'detail': 'Invalid request detected'
                }, status=400)
        
        # Check request body for POST/PUT/PATCH
        if request.method in ['POST', 'PUT', 'PATCH']:
            try:
                body = request.body.decode('utf-8').lower()
                for pattern in self.SUSPICIOUS_PATTERNS:
                    if pattern in body:
                        logger.warning(
                            f'Suspicious pattern in body: {pattern} '
                            f'from IP {self.get_client_ip(request)}'
                        )
                        return JsonResponse({
                            'error': 'درخواست نامعتبر',
                            'detail': 'Invalid request body'
                        }, status=400)
            except:
                pass
        
        return None
    
    def get_client_ip(self, request):
        """دریافت IP واقعی کلاینت"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class IPWhitelistMiddleware(MiddlewareMixin):
    """
    محدود کردن دسترسی به پنل ادمین به IP های مشخص
    """
    def process_request(self, request):
        # فقط برای پنل ادمین
        admin_url = getattr(settings, 'ADMIN_URL', 'admin/')
        if not request.path.startswith(f'/{admin_url}'):
            return None
        
        # لیست IP های مجاز (از environment variable)
        whitelist = settings.ADMIN_IP_WHITELIST if hasattr(settings, 'ADMIN_IP_WHITELIST') else []
        
        if not whitelist or not whitelist[0]:
            return None
        
        client_ip = self.get_client_ip(request)
        
        if client_ip not in whitelist:
            logger.warning(f'Unauthorized admin access attempt from IP: {client_ip}')
            return JsonResponse({
                'error': 'دسترسی غیرمجاز',
                'detail': 'Access denied'
            }, status=403)
        
        return None
    
    def get_client_ip(self, request):
        """دریافت IP واقعی کلاینت"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class APIKeyMiddleware(MiddlewareMixin):
    """
    اعتبارسنجی API Key برای عملیات حساس
    """
    def process_request(self, request):
        # فقط برای درخواست‌های نوشتن (POST, PUT, PATCH, DELETE)
        if request.method not in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return None
        
        # چک کردن اینکه آیا API Key الزامی است
        if not getattr(settings, 'REQUIRE_API_KEY_FOR_WRITE', False):
            return None
        
        # مسیرهایی که نیاز به API Key ندارند
        exempt_paths = [
            '/api/auth/login/',
            '/api/auth/register/',
            '/api/auth/refresh/',
        ]
        
        if any(request.path.startswith(path) for path in exempt_paths):
            return None
        
        # دریافت API Key از header
        api_key_header = getattr(settings, 'API_KEY_HEADER', 'X-API-Key')
        provided_key = request.META.get(f'HTTP_{api_key_header.upper().replace("-", "_")}')
        
        # لیست API Key های معتبر (باید از environment variable بیاد)
        valid_keys = os.environ.get('VALID_API_KEYS', '').split(',')
        
        if not provided_key or provided_key not in valid_keys:
            logger.warning(
                f'Invalid or missing API key from IP {self.get_client_ip(request)} '
                f'for {request.method} {request.path}'
            )
            return JsonResponse({
                'error': 'API Key نامعتبر یا وجود ندارد',
                'detail': 'Invalid or missing API key'
            }, status=401)
        
        return None
    
    def get_client_ip(self, request):
        """دریافت IP واقعی کلاینت"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class SQLInjectionProtectionMiddleware(MiddlewareMixin):
    """
    محافظت پیشرفته در برابر SQL Injection
    """
    SQL_PATTERNS = [
        r'(\bunion\b.*\bselect\b)',
        r'(\bselect\b.*\bfrom\b)',
        r'(\binsert\b.*\binto\b)',
        r'(\bupdate\b.*\bset\b)',
        r'(\bdelete\b.*\bfrom\b)',
        r'(\bdrop\b.*\btable\b)',
        r'(\bexec\b|\bexecute\b)',
        r'(;.*--)',
        r'(\/\*.*\*\/)',
    ]
    
    def process_request(self, request):
        import re
        
        # بررسی query string
        query_string = request.META.get('QUERY_STRING', '').lower()
        for pattern in self.SQL_PATTERNS:
            if re.search(pattern, query_string, re.IGNORECASE):
                logger.critical(
                    f'SQL Injection attempt detected from IP {self.get_client_ip(request)}: '
                    f'{query_string}'
                )
                return JsonResponse({
                    'error': 'درخواست مشکوک شناسایی شد',
                    'detail': 'Suspicious request detected'
                }, status=400)
        
        return None
    
    def get_client_ip(self, request):
        """دریافت IP واقعی کلاینت"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
