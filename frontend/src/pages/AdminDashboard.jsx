import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
    fetchStats();
  }, []);

  const checkAdminAccess = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.is_staff) {
      navigate('/');
    }
  };

  const fetchStats = async () => {
    try {
      const [users, orders, products] = await Promise.all([
        api.get('/accounts/users/'),
        api.get('/orders/orders/'),
        api.get('/products/products/')
      ]);
      
      setStats({
        totalUsers: users.data.length || users.data.count || 0,
        totalOrders: orders.data.length || orders.data.count || 0,
        totalProducts: products.data.length || products.data.count || 0,
        pendingOrders: orders.data.filter ? 
          orders.data.filter(o => o.status === 'pending').length : 0
      });
    } catch (error) {
      console.error('خطا در دریافت آمار:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, onClick }) => (
    <div 
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-2">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-8">پنل مدیریت</h1>

      {/* آمار کلی */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="کل کاربران"
          value={stats.totalUsers}
          icon="👥"
          color="border-r-4 border-blue-500"
          onClick={() => navigate('/admin/users')}
        />
        <StatCard
          title="کل سفارشات"
          value={stats.totalOrders}
          icon="📦"
          color="border-r-4 border-green-500"
          onClick={() => navigate('/admin/orders')}
        />
        <StatCard
          title="کل محصولات"
          value={stats.totalProducts}
          icon="🛍️"
          color="border-r-4 border-purple-500"
          onClick={() => navigate('/admin/products')}
        />
        <StatCard
          title="سفارشات در انتظار"
          value={stats.pendingOrders}
          icon="⏳"
          color="border-r-4 border-orange-500"
          onClick={() => navigate('/admin/orders')}
        />
      </div>

      {/* منوی سریع */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">دسترسی سریع</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/admin/products/new')}
            className="bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors"
          >
            ➕ افزودن محصول جدید
          </button>
          <button
            onClick={() => navigate('/admin/orders')}
            className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
          >
            📋 مدیریت سفارشات
          </button>
          <button
            onClick={() => navigate('/admin/users')}
            className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors"
          >
            👤 مدیریت کاربران
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
