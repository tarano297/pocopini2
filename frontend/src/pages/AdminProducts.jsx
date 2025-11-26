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
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">مدیریت محصولات</h1>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600"
        >
          ➕ افزودن محصول
        </button>
      </div>

      {/* فیلتر */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}
          >
            همه ({products.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded ${filter === 'active' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            فعال ({products.filter(p => p.is_active).length})
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 rounded ${filter === 'inactive' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          >
            غیرفعال ({products.filter(p => !p.is_active).length})
          </button>
        </div>
      </div>

      {/* لیست محصولات */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right">تصویر</th>
              <th className="px-6 py-3 text-right">نام</th>
              <th className="px-6 py-3 text-right">دسته‌بندی</th>
              <th className="px-6 py-3 text-right">قیمت</th>
              <th className="px-6 py-3 text-right">موجودی</th>
              <th className="px-6 py-3 text-right">وضعیت</th>
              <th className="px-6 py-3 text-right">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredProducts.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">{product.price.toLocaleString()} تومان</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.is_active ? 'فعال' : 'غیرفعال'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleToggleActive(product)}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      {product.is_active ? '🔒' : '🔓'}
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
