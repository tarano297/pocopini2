from rest_framework import serializers
from .models import Product, ProductVariant


class ProductVariantSerializer(serializers.ModelSerializer):
    """
    Serializer برای تنوع محصولات
    """
    color_display = serializers.CharField(source='get_color_display', read_only=True)
    size_display = serializers.CharField(source='get_size_display', read_only=True)
    is_in_stock = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = ProductVariant
        fields = [
            'id', 'color', 'color_display', 'size', 'size_display',
            'price', 'stock', 'sku', 'image', 'is_in_stock', 'is_active'
        ]
        read_only_fields = ['id', 'sku']


class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer برای محصولات
    """
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    season_display = serializers.CharField(source='get_season_display', read_only=True)
    is_in_stock = serializers.BooleanField(read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    available_colors = serializers.ListField(read_only=True)
    available_sizes = serializers.ListField(read_only=True)
    min_price = serializers.DecimalField(max_digits=10, decimal_places=0, read_only=True)
    max_price = serializers.DecimalField(max_digits=10, decimal_places=0, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'category', 'category_display',
            'season', 'season_display', 'image', 'is_in_stock', 'is_active',
            'variants', 'available_colors', 'available_sizes', 'min_price', 'max_price',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProductListSerializer(serializers.ModelSerializer):
    """
    Serializer ساده برای لیست محصولات (بدون جزئیات کامل)
    """
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    season_display = serializers.CharField(source='get_season_display', read_only=True)
    is_in_stock = serializers.BooleanField(read_only=True)
    min_price = serializers.DecimalField(max_digits=10, decimal_places=0, read_only=True)
    max_price = serializers.DecimalField(max_digits=10, decimal_places=0, read_only=True)
    variants_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'min_price', 'max_price', 'category', 'category_display',
            'season', 'season_display', 'image', 'is_in_stock', 'variants_count', 'created_at'
        ]
    
    def get_variants_count(self, obj):
        return obj.variants.count()
