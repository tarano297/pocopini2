from rest_framework import serializers
from .models import Review
from orders.models import OrderItem


class ReviewSerializer(serializers.ModelSerializer):
    """
    Serializer برای نظرات
    """
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_first_name = serializers.CharField(source='user.first_name', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'product', 'product_name', 'user', 'user_username',
            'user_first_name', 'rating', 'comment', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("امتیاز باید بین ۱ تا ۵ باشد.")
        return value

    def validate(self, attrs):
        request = self.context.get('request')
        product = attrs.get('product')
        
        # بررسی اینکه کاربر قبلاً نظر ثبت نکرده باشد (فقط برای create)
        if not self.instance:
            if Review.objects.filter(user=request.user, product=product).exists():
                raise serializers.ValidationError("شما قبلاً برای این محصول نظر ثبت کرده‌اید.")
            
            # بررسی اینکه کاربر محصول را خریداری کرده باشد
            has_purchased = OrderItem.objects.filter(
                order__user=request.user,
                product=product,
                order__status__in=['delivered', 'shipped']
            ).exists()
            
            if not has_purchased:
                raise serializers.ValidationError("شما این محصول را خریداری نکرده‌اید.")
        
        return attrs

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
