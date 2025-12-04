from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Review
from .serializers import ReviewSerializer
from .permissions import IsOwnerOrReadOnly


class ReviewViewSet(viewsets.ModelViewSet):
    """
    ViewSet برای مدیریت نظرات
    """
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        """فیلتر نظرات بر اساس محصول"""
        queryset = Review.objects.select_related('user', 'product')
        product_id = self.request.query_params.get('product_id')
        
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        
        return queryset

    def perform_create(self, serializer):
        """ذخیره نظر با کاربر فعلی"""
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='product/(?P<product_id>[^/.]+)')
    def by_product(self, request, product_id=None):
        """
        دریافت نظرات یک محصول خاص
        """
        reviews = Review.objects.filter(product_id=product_id).select_related('user', 'product')
        serializer = self.get_serializer(reviews, many=True)
        
        # محاسبه میانگین امتیاز
        avg_rating = 0
        if reviews.exists():
            total_rating = sum(review.rating for review in reviews)
            avg_rating = round(total_rating / reviews.count(), 1)
        
        return Response({
            'reviews': serializer.data,
            'count': reviews.count(),
            'average_rating': avg_rating
        })

    @action(detail=False, methods=['get'])
    def my_reviews(self, request):
        """
        دریافت نظرات خود کاربر
        """
        reviews = Review.objects.filter(user=request.user).select_related('product')
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)
