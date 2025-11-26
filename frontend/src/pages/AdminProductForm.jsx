import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const AdminProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'baby',
    season: 'winter',
    color: '',
    size: '',
    stock: '',
    is_active: true
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/products/${id}/`);
      setFormData(response.data);
      setImagePreview(response.data.image);
    } catch (error) {
      alert('خطا در دریافت اطلاعات محصول');
      navigate('/admin/products');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      
      if (image) {
        data.append('image', image);
      }

      if (isEdit) {
        await api.put(`/products/products/${id}/`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('محصول با موفقیت ویرایش شد');
      } else {
        await api.post('/products/products/', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('محصول با موفقیت اضافه شد');
      }
      
      navigate('/admin/products');
    } catch (error) {
      console.error('خطا:', error);
      alert('خطا در ذخیره محصول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          {isEdit ? 'ویرایش محصول' : 'افزودن محصول جدید'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* نام محصول */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">نام محصول *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* توضیحات */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">توضیحات *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* تصویر */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">تصویر محصول *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="پیش‌نمایش"
                className="mt-4 w-48 h-48 object-cover rounded-lg"
              />
            )}
          </div>

          {/* دسته‌بندی و فصل */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">دسته‌بندی *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="baby">نوزاد</option>
                <option value="girl">دخترانه</option>
                <option value="boy">پسرانه</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">فصل *</label>
              <select
                name="season"
                value={formData.season}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="winter">زمستان</option>
                <option value="spring">بهار</option>
                <option value="summer">تابستان</option>
                <option value="fall">پاییز</option>
              </select>
            </div>
          </div>

          {/* رنگ و سایز */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">رنگ *</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">سایز *</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          {/* قیمت و موجودی */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">قیمت (تومان) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">موجودی *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          {/* وضعیت فعال */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="ml-2"
              />
              <span className="text-gray-700">محصول فعال است</span>
            </label>
          </div>

          {/* دکمه‌ها */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-pink-500 text-white py-2 px-6 rounded-lg hover:bg-pink-600 disabled:bg-gray-400"
            >
              {loading ? 'در حال ذخیره...' : isEdit ? 'ویرایش محصول' : 'افزودن محصول'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;
