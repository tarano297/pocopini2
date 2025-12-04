# Generated migration for performance optimization

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reviews', '0001_initial'),
    ]

    operations = [
        migrations.AddIndex(
            model_name='review',
            index=models.Index(fields=['product', '-created_at'], name='reviews_rev_product_idx'),
        ),
        migrations.AddIndex(
            model_name='review',
            index=models.Index(fields=['user', '-created_at'], name='reviews_rev_user_idx'),
        ),
        migrations.AddIndex(
            model_name='review',
            index=models.Index(fields=['rating'], name='reviews_rev_rating_idx'),
        ),
        migrations.AddIndex(
            model_name='review',
            index=models.Index(fields=['-created_at'], name='reviews_rev_created_idx'),
        ),
    ]
