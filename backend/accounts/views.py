from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Address, User
from .serializers import RegisterSerializer, LoginSerializer, UserProfileSerializer, AddressSerializer


class RegisterView(generics.CreateAPIView):
    """
    API برای ثبت‌نام کاربر جدید
    """
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # ایجاد JWT token برای کاربر جدید
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserProfileSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'ثبت‌نام با موفقیت انجام شد.'
        }, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    """
    API برای ورود کاربر
    """
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        
        # ایجاد JWT token
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserProfileSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'ورود با موفقیت انجام شد.'
        }, status=status.HTTP_200_OK)


class ProfileView(generics.RetrieveUpdateAPIView):
    """
    API برای نمایش و ویرایش پروفایل کاربر
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class AddressViewSet(viewsets.ModelViewSet):
    """
    ViewSet برای مدیریت آدرس‌های کاربر
    """
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # فقط آدرس‌های خود کاربر را نمایش بده
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # کاربر فعلی را به عنوان صاحب آدرس تنظیم کن
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def set_default(self, request, pk=None):
        """
        تنظیم آدرس به عنوان آدرس پیش‌فرض
        """
        address = self.get_object()
        
        # همه آدرس‌های کاربر را غیرپیش‌فرض کن
        Address.objects.filter(user=request.user).update(is_default=False)
        
        # این آدرس را پیش‌فرض کن
        address.is_default = True
        address.save()
        
        return Response({
            'message': 'آدرس به عنوان پیش‌فرض تنظیم شد.',
            'address': AddressSerializer(address).data
        }, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet برای مدیریت کاربران (فقط برای ادمین)
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAdminUser]
    queryset = User.objects.all().order_by('-date_joined')
