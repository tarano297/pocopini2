# راهنمای رفع مشکلات سبد خرید

## مشکلات شناسایی شده

### 1. تغییر رنگ همه دکمه‌ها به آبی
**علت:** تابع `isInCart` به درستی محصولات را شناسایی نمی‌کرد

**راه‌حل:**
- بهبود تابع `isInCart` در CartContext
- اضافه کردن چک‌های امنیتی برای جلوگیری از خطا
- اطمینان از مقایسه صحیح `product_id` با `product.id`

### 2. عدم نمایش فوری تعداد در آیکون سبد خرید
**علت:** بعد از افزودن محصول، state به‌روزرسانی نمی‌شد

**راه‌حل:**
- اضافه کردن fetch مجدد سبد خرید بعد از افزودن موفق
- بهبود مدیریت response از API
- اطمینان از آپدیت صحیح `itemCount`

## تغییرات انجام شده

### ProductCard.jsx
```javascript
// جلوگیری از کلیک مکرر
if (isLoading) return;

// اضافه کردن console.log برای debug
React.useEffect(() => {
  console.log(`Product ${product.id} - inCart: ${inCart}, quantity: ${quantity}`);
}, [inCart, quantity, product.id]);
```

### CartContext.jsx
```javascript
// بهبود تابع isInCart
const isInCart = (productId) => {
  if (!productId || !state.cartItems || state.cartItems.length === 0) {
    return false;
  }
  
  return state.cartItems.some(item => {
    const itemProductId = item.product?.id || item.product_id;
    return itemProductId === productId;
  });
};

// بهبود تابع addToCart
if (cartData && cartData.items) {
  dispatch({
    type: CART_ACTIONS.ADD_TO_CART_SUCCESS,
    payload: cartData,
  });
} else {
  // fetch مجدد سبد خرید
  await fetchCart();
}
```

## نحوه تست

### 1. تست افزودن به سبد
```bash
# راه‌اندازی سرورها
cd frontend
npm start

cd backend
python manage.py runserver
```

### 2. بررسی Console
- باز کردن Developer Tools (F12)
- رفتن به تب Console
- کلیک روی دکمه "افزودن به سبد"
- بررسی log ها

### 3. موارد قابل بررسی
- [ ] دکمه فقط یک محصول تغییر رنگ می‌دهد (سبز می‌شود)
- [ ] آیکون سبد خرید بلافاصله آپدیت می‌شود
- [ ] تعداد محصولات در آیکون نمایش داده می‌شود
- [ ] دکمه‌های دیگر آبی باقی می‌مانند

## مشکلات احتمالی

### اگر هنوز مشکل دارید:

#### 1. پاک کردن Cache
```bash
# پاک کردن cache مرورگر
Ctrl + Shift + Delete

# یا در Chrome
Ctrl + Shift + R (Hard Refresh)
```

#### 2. بررسی localStorage
```javascript
// در Console مرورگر
localStorage.getItem('guest_cart')
```

#### 3. بررسی Network
- باز کردن تب Network در Developer Tools
- کلیک روی "افزودن به سبد"
- بررسی request به `/orders/cart/add/`
- بررسی response

#### 4. بررسی State
```javascript
// اضافه کردن به ProductCard برای debug
console.log('Cart Items:', cartItems);
console.log('Product ID:', product.id);
console.log('Is In Cart:', inCart);
```

## نکات مهم

### 1. ساختار داده سبد خرید
```javascript
// هر item در سبد خرید باید این ساختار را داشته باشد:
{
  id: 1,
  product_id: 5,
  product: {
    id: 5,
    name: "نام محصول",
    price: 100000
  },
  quantity: 2
}
```

### 2. مقایسه ID ها
```javascript
// همیشه از این روش استفاده کنید:
const itemProductId = item.product?.id || item.product_id;
const matches = itemProductId === productId;
```

### 3. آپدیت State
```javascript
// بعد از هر تغییر در سبد، state باید آپدیت شود:
dispatch({
  type: CART_ACTIONS.ADD_TO_CART_SUCCESS,
  payload: { items: updatedItems }
});
```

## تست نهایی

### Checklist قبل از Deploy
- [ ] تمام console.log های debug حذف شده‌اند
- [ ] تست در مرورگرهای مختلف (Chrome, Firefox, Edge)
- [ ] تست با کاربر لاگین شده
- [ ] تست با کاربر مهمان (guest)
- [ ] تست با محصولات مختلف
- [ ] تست با چند محصول همزمان
- [ ] بررسی عملکرد در موبایل

## منابع بیشتر

- [React Context API](https://react.dev/reference/react/useContext)
- [React useReducer](https://react.dev/reference/react/useReducer)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
