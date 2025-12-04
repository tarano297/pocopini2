import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    todayOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

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
      
      const ordersData = orders.data.results || orders.data || [];
      const totalRevenue = ordersData.reduce((sum, order) => sum + (order.total_price || 0), 0);
      const today = new Date().toDateString();
      const todayOrders = ordersData.filter(o => new Date(o.created_at).toDateString() === today).length;
      
      setStats({
        totalUsers: users.data.length || users.data.count || 0,
        totalOrders: ordersData.length || orders.data.count || 0,
        totalProducts: products.data.length || products.data.count || 0,
        pendingOrders: ordersData.filter ? ordersData.filter(o => o.status === 'pending').length : 0,
        totalRevenue,
        todayOrders
      });
      
      // آخرین سفارشات
      setRecentOrders(ordersData.slice(0, 5));
    } catch (error) {
      console.error('خطا در دریافت آمار:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, gradient, trend, onClick }) => (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative group"
    >
      <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-14 h-14 rounded-xl ${gradient} flex items-center justify-center text-2xl shadow-lg`}>
            {icon}
          </div>
          {trend && (
            <span className={`text-sm font-semibold ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
        <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎯 داشبورد مدیریت
          </h1>
          <p className="text-gray-600">خوش آمدید! مدیریت فروشگاه پوکوپینی</p>
        </div>

        {/* آمار کلی */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="کل کاربران"
            value={stats.totalUsers.toLocaleString()}
            icon="👥"
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
            trend={12}
            onClick={() => navigate('/admin/users')}
          />
          <StatCard
            title="کل سفارشات"
            value={stats.totalOrders.toLocaleString()}
            icon="📦"
            gradient="bg-gradient-to-br from-green-500 to-green-600"
            trend={8}
            onClick={() => navigate('/admin/orders')}
          />
          <StatCard
            title="کل محصولات"
            value={stats.totalProducts.toLocaleString()}
            icon="🛍️"
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
            trend={5}
            onClick={() => navigate('/admin/products')}
          />
          <StatCard
            title="سفارشات در انتظار"
            value={stats.pendingOrders.toLocaleString()}
            icon="⏳"
            gradient="bg-gradient-to-br from-orange-500 to-orange-600"
            onClick={() => navigate('/admin/orders')}
          />
          <StatCard
            title="درآمد کل"
            value={`${(stats.totalRevenue / 1000000).toFixed(1)}M`}
            icon="💰"
            gradient="bg-gradient-to-br from-pink-500 to-pink-600"
            trend={15}
          />
          <StatCard
            title="سفارشات امروز"
            value={stats.todayOrders.toLocaleString()}
            icon="🔥"
            gradient="bg-gradient-to-br from-red-500 to-red-600"
            trend={20}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* منوی سریع */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <span className="w-2 h-8 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full ml-3"></span>
                دسترسی سریع
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/admin/products/new')}
                  className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 px-6 rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-between group"
                >
                  <span className="flex items-center">
                    <span className="text-2xl ml-3">➕</span>
                    افزودن محصول جدید
                  </span>
                  <span className="transform group-hover:translate-x-1 transition-transform">←</span>
                </button>
                <button
                  onClick={() => navigate('/admin/orders')}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-between group"
                >
                  <span className="flex items-center">
                    <span className="text-2xl ml-3">📋</span>
                    مدیریت سفارشات
                  </span>
                  <span className="transform group-hover:translate-x-1 transition-transform">←</span>
                </button>
                <button
                  onClick={() => navigate('/admin/users')}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-between group"
                >
                  <span className="flex items-center">
                    <span className="text-2xl ml-3">👤</span>
                    مدیریت کاربران
                  </span>
                  <span className="transform group-hover:translate-x-1 transition-transform">←</span>
                </button>
                <button
                  onClick={() => navigate('/admin/products')}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-between group"
                >
                  <span className="flex items-center">
                    <span className="text-2xl ml-3">📦</span>
                    مدیریت محصولات
                  </span>
                  <span className="transform group-hover:translate-x-1 transition-transform">←</span>
                </button>
              </div>
            </div>
          </div>

          {/* آخرین سفارشات */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center justify-between">
                <span className="flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full ml-3"></span>
                  آخرین سفارشات
                </span>
                <button 
                  onClick={() => navigate('/admin/orders')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  مشاهده همه ←
                </button>
              </h2>
              <div className="space-y-3">
                {recentOrders.length > 0 ? (
                  recentOrders.map(order => (
                    <div 
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => navigate('/admin/orders')}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                          #{order.id}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {order.user?.username || 'کاربر'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString('fa-IR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-gray-800">
                          {order.total_price?.toLocaleString()} تومان
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status === 'pending' ? 'در انتظار' :
                           order.status === 'processing' ? 'در حال پردازش' :
                           order.status === 'delivered' ? 'تحویل شده' : order.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-4xl mb-2">📭</p>
                    <p>سفارشی وجود ندارد</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
