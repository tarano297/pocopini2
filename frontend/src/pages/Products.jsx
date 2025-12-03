import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Products = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const category = searchParams.get('category');
      const season = searchParams.get('season');
      const search = searchParams.get('search');
      
      if (category) params.append('category', category);
      if (season) params.append('season', season);
      if (search) params.append('search', search);

      const response = await api.get(`/products/?${params.toString()}`);
      setProducts(response.data.results || response.data);
    } catch (error) {
      console.error('خطا در دریافت محصولات:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      baby: 'نوزاد',
      girl: 'دخترانه',
      boy: 'پسرانه'
    };
    return labels[category] || '';
  };

  const getSeasonLabel = (season) => {
    const labels = {
      spring: 'بهار',
      summer: 'تابستان',
      autumn: 'پاییز',
      winter: 'زمستان'
    };
    return labels[season] || '';
  };

  const getPageTitle = () => {
    const category = searchParams.get('category');
    const season = searchParams.get('season');
    const search = searchParams.get('search');

    if (search) return `نتایج جستجو: ${search}`;
    
    const parts = [];
    if (category) parts.push(getCategoryLabel(category));
    if (season) parts.push(getSeasonLabel(season));
    
    return parts.length > 0 ? parts.join(' - ') : 'همه محصولات';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">
        {getPageTitle()}
      </h1>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">محصولی یافت نشد</p>
          <button
            onClick={() => navigate('/')}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-pink-600 font-bold text-lg">
                    {product.price.toLocaleString()} تومان
                  </span>
                  {product.is_in_stock ? (
                    <span className="text-green-600 text-sm">موجود</span>
                  ) : (
                    <span className="text-red-600 text-sm">ناموجود</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
