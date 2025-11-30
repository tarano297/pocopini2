"""
Email utility functions for Pokopini
"""
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags


def send_contact_email(name, email, subject, message):
    """
    ارسال ایمیل تماس با ما به ادمین
    """
    email_subject = f'پیام جدید از {name}: {subject}'
    email_body = f"""
    پیام جدید از فرم تماس با ما:
    
    نام: {name}
    ایمیل: {email}
    موضوع: {subject}
    
    پیام:
    {message}
    
    ---
    برای پاسخ، به ایمیل {email} پیام بفرستید.
    """
    
    try:
        send_mail(
            subject=email_subject,
            message=email_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.ADMIN_EMAIL],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"خطا در ارسال ایمیل: {str(e)}")
        return False


def send_order_confirmation_email(order):
    """
    ارسال ایمیل تایید سفارش به مشتری
    """
    subject = f'تایید سفارش #{order.id} - پوکوپینی'
    message = f"""
    سلام {order.user.get_full_name()},
    
    سفارش شما با موفقیت ثبت شد!
    
    شماره سفارش: {order.id}
    مبلغ کل: {order.total_price:,} تومان
    وضعیت: {order.get_status_display()}
    
    برای مشاهده جزئیات سفارش به پنل کاربری خود مراجعه کنید.
    
    با تشکر از خرید شما
    تیم پوکوپینی
    """
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.user.email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"خطا در ارسال ایمیل: {str(e)}")
        return False


def send_order_status_update_email(order):
    """
    ارسال ایمیل تغییر وضعیت سفارش
    """
    status_messages = {
        'pending': 'در انتظار پرداخت',
        'processing': 'در حال پردازش',
        'shipped': 'ارسال شده',
        'delivered': 'تحویل داده شده',
        'cancelled': 'لغو شده',
    }
    
    subject = f'تغییر وضعیت سفارش #{order.id}'
    message = f"""
    سلام {order.user.get_full_name()},
    
    وضعیت سفارش شما تغییر کرد:
    
    شماره سفارش: {order.id}
    وضعیت جدید: {status_messages.get(order.status, order.status)}
    
    برای مشاهده جزئیات به پنل کاربری خود مراجعه کنید.
    
    با تشکر
    تیم پوکوپینی
    """
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.user.email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"خطا در ارسال ایمیل: {str(e)}")
        return False


def send_welcome_email(user):
    """
    ارسال ایمیل خوش‌آمدگویی به کاربر جدید
    """
    subject = 'خوش آمدید به پوکوپینی!'
    message = f"""
    سلام {user.get_full_name()},
    
    به پوکوپینی خوش آمدید!
    
    حساب کاربری شما با موفقیت ایجاد شد.
    اکنون می‌توانید از تمام امکانات سایت استفاده کنید.
    
    با آرزوی خریدی خوش
    تیم پوکوپینی
    """
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"خطا در ارسال ایمیل: {str(e)}")
        return False
