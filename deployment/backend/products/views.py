from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product
from .serializers import ProductSerializer, ProductListSerializer


class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet برای مدیریت محصولات
    - خواندن برای همه
    - ایجاد/ویرایش/حذف فقط برای ادمین
    """
    queryset = Product.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'season']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']

    def get_queryset(self):
        """
        برای ادمین همه محصولات، برای کاربران عادی فقط محصولات فعال
        با بهینه‌سازی برای کاهش تعداد queries
        """
        queryset = Product.objects.select_related().prefetch_related('reviews', 'variants')
        
        if self.request.user.is_staff:
            return queryset
        return queryset.filter(is_active=True)

    def get_permissions(self):
        """
        تنظیم دسترسی‌ها
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticatedOrReadOnly()]

    def get_serializer_class(self):
        """استفاده از serializer مناسب بر اساس action"""
        if self.action == 'list':
            return ProductListSerializer
        return ProductSerializer

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """
        محصولات ویژه برای صفحه اصلی
        (۸ محصول جدید) با caching
        """
        from django.core.cache import cache
        
        cache_key = 'featured_products'
        products = cache.get(cache_key)
        
        if products is None:
            products = list(self.get_queryset().order_by('-created_at')[:8])
            cache.set(cache_key, products, 300)  # Cache for 5 minutes
        
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """
        دسته‌بندی محصولات بر اساس category
        """
        categories = Product.CATEGORY_CHOICES
        result = {}
        
        for category_code, category_name in categories:
            products = self.get_queryset().filter(category=category_code)[:4]
            result[category_code] = {
                'name': category_name,
                'products': ProductListSerializer(products, many=True).data
            }
        
        return Response(result)

    @action(detail=False, methods=['get'])
    def colors(self, request):
        """
        لیست رنگ‌های موجود از variants با نمایش فارسی
        """
        from .models import ProductVariant
        colors = ProductVariant.objects.filter(is_active=True).values_list('color', flat=True).distinct()
        color_choices = dict(ProductVariant.COLOR_CHOICES)
        result = [{'value': c, 'label': color_choices.get(c, c)} for c in colors if c]
        return Response(result)

    @action(detail=False, methods=['get'])
    def sizes(self, request):
        """
        لیست سایزهای موجود از variants با نمایش فارسی
        """
        from .models import ProductVariant
        sizes = ProductVariant.objects.filter(is_active=True).values_list('size', flat=True).distinct()
        size_choices = dict(ProductVariant.SIZE_CHOICES)
        result = [{'value': s, 'label': size_choices.get(s, s)} for s in sizes if s]
        return Response(result)
