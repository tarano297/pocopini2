"""
General views for Pokopini
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .email_utils import send_contact_email


@api_view(['POST'])
@permission_classes([AllowAny])
def contact_view(request):
    """
    API endpoint برای فرم تماس با ما
    """
    name = request.data.get('name')
    email = request.data.get('email')
    subject = request.data.get('subject')
    message = request.data.get('message')
    
    # Validation
    if not all([name, email, subject, message]):
        return Response(
            {'error': 'تمام فیلدها الزامی هستند'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Send email
    success = send_contact_email(name, email, subject, message)
    
    if success:
        return Response(
            {'message': 'پیام شما با موفقیت ارسال شد'},
            status=status.HTTP_200_OK
        )
    else:
        return Response(
            {'error': 'خطا در ارسال پیام. لطفا دوباره تلاش کنید'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
