# Orders & Cart API Endpoints

---

# Order API Endpoints

## لیست سفارشات
**GET** `/api/orders/orders/`

نمایش لیست سفارشات کاربر احراز هویت شده (یا همه سفارشات برای ادمین)

**Response:**
```json
{
  "count": 10,
  "next": "http://localhost:8000/api/orders/orders/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "user": 1,
      "user_username": "john_doe",
      "address": 1,
      "status": "pending",
      "status_display": "در انتظار",
      "total_price": "450000",
      "items": [
        {
          "id": 1,
          "product": {
            "id": 1,
            "name": "تیشرت نوزادی",
            "price": "150000",
            "image": "/media/products/shirt.jpg"
          },
          "quantity": 3,
          "price": "150000",
          "subtotal": "450000"
        }
      ],
      "created_at": "2024-01-01T10:00:00Z",
      "created_at_jalali": "1402/10/11 10:00:00",
      "updated_at": "2024-01-01T10:00:00Z",
      "updated_at_jalali": "1402/10/11 10:00:00"
    }
  ]
}
```

## جزئیات سفارش
**GET** `/api/orders/orders/{id}/`

نمایش جزئیات یک سفارش خاص

**Response:**
```json
{
  "id": 1,
  "user": 1,
  "user_username": "john_doe",
  "address": 1,
  "status": "pending",
  "status_display": "در انتظار",
  "total_price": "450000",
  "items": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "name": "تیشرت نوزادی",
        "price": "150000",
        "image": "/media/products/shirt.jpg",
        "category": "baby",
        "season": "summer"
      },
      "quantity": 3,
      "price": "150000",
      "subtotal": "450000"
    }
  ],
  "created_at": "2024-01-01T10:00:00Z",
  "created_at_jalali": "1402/10/11 10:00:00",
  "updated_at": "2024-01-01T10:00:00Z",
  "updated_at_jalali": "1402/10/11 10:00:00"
}
```

## ثبت سفارش جدید
**POST** `/api/orders/orders/`

ایجاد سفارش جدید از محتویات سبد خرید

**Request Body:**
```json
{
  "address_id": 1
}
```

**Response:**
```json
{
  "message": "سفارش با موفقیت ثبت شد.",
  "order": {
    "id": 1,
    "user": 1,
    "user_username": "john_doe",
    "address": 1,
    "status": "pending",
    "status_display": "در انتظار",
    "total_price": "450000",
    "items": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "name": "تیشرت نوزادی",
          "price": "150000",
          "image": "/media/products/shirt.jpg"
        },
        "quantity": 3,
        "price": "150000",
        "subtotal": "450000"
      }
    ],
    "created_at": "2024-01-01T10:00:00Z",
    "created_at_jalali": "1402/10/11 10:00:00",
    "updated_at": "2024-01-01T10:00:00Z",
    "updated_at_jalali": "1402/10/11 10:00:00"
  }
}
```

## نکات مهم - سفارشات

1. تمام APIها نیاز به احراز هویت دارند (JWT Token)
2. هر کاربر فقط به سفارشات خودش دسترسی دارد (ادمین به همه دسترسی دارد)
3. هنگام ثبت سفارش، محتویات سبد خرید به سفارش منتقل می‌شود
4. پس از ثبت سفارش، سبد خرید خالی می‌شود
5. موجودی محصولات به صورت خودکار کم می‌شود
6. تاریخ سفارش به صورت شمسی (جلالی) نیز برگردانده می‌شود
7. قیمت محصولات در زمان خرید ذخیره می‌شود (برای جلوگیری از تغییرات بعدی)

---

# Cart API Endpoints

## نمایش سبد خرید
**GET** `/api/orders/cart/`

نمایش محتویات سبد خرید کاربر احراز هویت شده

**Response:**
```json
{
  "id": 1,
  "items": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "name": "تیشرت نوزادی",
        "price": "150000",
        "image": "/media/products/shirt.jpg"
      },
      "product_id": 1,
      "quantity": 2,
      "subtotal": "300000",
      "created_at": "2024-01-01T10:00:00Z"
    }
  ],
  "total_price": "300000",
  "items_count": 2,
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-01T10:00:00Z"
}
```

## افزودن محصول به سبد
**POST** `/api/orders/cart/add/`

افزودن محصول جدید به سبد خرید یا افزایش تعداد محصول موجود

**Request Body:**
```json
{
  "product_id": 1,
  "quantity": 2
}
```

**Response:**
```json
{
  "message": "محصول به سبد خرید اضافه شد.",
  "cart": {
    "id": 1,
    "items": [...],
    "total_price": "300000",
    "items_count": 2
  }
}
```

## به‌روزرسانی تعداد محصول
**PUT** `/api/orders/cart/update/{item_id}/`

تغییر تعداد یک محصول در سبد خرید

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:**
```json
{
  "message": "تعداد محصول به‌روزرسانی شد.",
  "cart": {
    "id": 1,
    "items": [...],
    "total_price": "450000",
    "items_count": 3
  }
}
```

## حذف محصول از سبد
**DELETE** `/api/orders/cart/remove/{item_id}/`

حذف یک محصول از سبد خرید

**Response:**
```json
{
  "message": "محصول از سبد خرید حذف شد.",
  "cart": {
    "id": 1,
    "items": [],
    "total_price": "0",
    "items_count": 0
  }
}
```

## خالی کردن سبد
**DELETE** `/api/orders/cart/clear/`

حذف تمام محصولات از سبد خرید

**Response:**
```json
{
  "message": "سبد خرید خالی شد."
}
```

## نکات مهم

1. تمام APIها نیاز به احراز هویت دارند (JWT Token)
2. هر کاربر فقط به سبد خرید خودش دسترسی دارد
3. اگر محصول قبلاً در سبد باشد، تعداد آن افزایش می‌یابد
4. محصولات غیرفعال یا ناموجود قابل افزودن به سبد نیستند
5. قیمت کل سبد به صورت خودکار محاسبه می‌شود
