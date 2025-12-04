import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products/products/');
      setProducts(response.data.results || response.data);
    } catch (error) {
      console.error('خطا در دریافت محصولات:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('آیا از حذف این محصول اطمینان دارید؟')) return;
    
    try {
      await api.delete(`/products/products/${id}/`);
      setProducts(products.filter(p => p.id !== id));
      alert('محصول با موفقیت حذف شد');
    } catch (error) {
      alert('خطا در حذف محصول');
    }
  };

  const handleToggleActive = async (product) => {
    try {
      await api.patch(`/products/products/${product.id}/`, {
        is_active: !product.is_active
      });
      fetchProducts();
    } catch (error) {
      alert('خطا در تغییر وضعیت محصول');
    }
  };

  const filteredProducts = products.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'active') return p.is_active;
    if (filter === 'inactive') return !p.is_active;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🛍️ مدیریت محصولات
            </h1>
            <p className="text-gray-600">مدیریت و ویرایش محصولات فروشگاه</p>
          </div>
          <button
            onClick={() => navigate('/admin/products/new')}
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <span className="text-xl">➕</span>
            افزودن محصول
          </button>
        </div>

        {/* فیلتر */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                filter === 'all' 
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              همه ({products.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                filter === 'active' 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              فعال ({products.filter(p => p.is_active).length})
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                filter === 'inactive' 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              غیرفعال ({products.filter(p => !p.is_active).length})
            </button>
          </div>
        </div>

        {/* لیست محصولات - Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
            >
              {/* تصویر محصول */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    product.is_active 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {product.is_active ? '✓ فعال' : '✗ غیرفعال'}
                  </span>
                </div>
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                      ناموجود
                    </span>
                  </div>
                )}
              </div>

              {/* اطلاعات محصول */}
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 h-12">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    موجودی: {product.stock}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-pink-600">
                    {product.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-600">تومان</span>
                </div>

                {/* دکمه‌های عملیات */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                    title="ویرایش"
                  >
                    <span>✏️</span>
                    <span className="text-sm">ویرایش</span>
                  </button>
                  <button
                    onClick={() => handleToggleActive(product)}
                    className={`flex-1 ${
                      product.is_active ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
                    } text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-1`}
                    title={product.is_active ? 'غیرفعال کردن' : 'فعال کردن'}
                  >
                    <span>{product.is_active ? '🔒' : '🔓'}</span>
                    <span className="text-sm">{product.is_active ? 'غیرفعال' : 'فعال'}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    title="حذف"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">محصولی یافت نشد</h3>
            <p className="text-gray-600 mb-6">هیچ محصولی با این فیلتر وجود ندارد</p>
            <button
              onClick={() => setFilter('all')}
              className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              نمایش همه محصولات
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
