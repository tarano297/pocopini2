import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/orders/');
      setOrders(response.data.results || response.data);
    } catch (error) {
      console.error('خطا در دریافت سفارشات:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/orders/${orderId}/`, { status: newStatus });
      fetchOrders();
      alert('وضعیت سفارش تغییر کرد');
    } catch (error) {
      alert('خطا در تغییر وضعیت');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'در انتظار',
      processing: 'در حال پردازش',
      shipped: 'ارسال شده',
      delivered: 'تحویل داده شده',
      cancelled: 'لغو شده'
    };
    return labels[status] || status;
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📦 مدیریت سفارشات
          </h1>
          <p className="text-gray-600">مشاهده و مدیریت تمام سفارشات</p>
        </div>

        {/* فیلتر */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                filter === 'all' 
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>📋</span>
              همه ({orders.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                filter === 'pending' 
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>⏳</span>
              در انتظار ({orders.filter(o => o.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('processing')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                filter === 'processing' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>⚙️</span>
              در حال پردازش ({orders.filter(o => o.status === 'processing').length})
            </button>
            <button
              onClick={() => setFilter('shipped')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                filter === 'shipped' 
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>🚚</span>
              ارسال شده ({orders.filter(o => o.status === 'shipped').length})
            </button>
            <button
              onClick={() => setFilter('delivered')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                filter === 'delivered' 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>✅</span>
              تحویل داده شده ({orders.filter(o => o.status === 'delivered').length})
            </button>
          </div>
        </div>

        {/* لیست سفارشات */}
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    #{order.id}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {order.user?.username || 'کاربر'}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        📅 {new Date(order.created_at).toLocaleDateString('fa-IR')}
                      </span>
                      <span className="flex items-center gap-1">
                        🕐 {new Date(order.created_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {order.total_price?.toLocaleString()} تومان
                  </p>
                  <span className={`inline-block px-4 py-2 rounded-xl text-sm font-semibold shadow-md ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>

              {/* آیتم‌های سفارش */}
              {order.items && order.items.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span>🛍️</span>
                    محصولات سفارش:
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <span className="font-medium text-gray-700">
                          {item.product?.name || item.product} 
                          <span className="text-pink-600 font-bold mx-2">×{item.quantity}</span>
                        </span>
                        <span className="font-bold text-gray-800">
                          {(item.price * item.quantity).toLocaleString()} تومان
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* تغییر وضعیت */}
              <div className="border-t pt-4">
                <label className="block text-sm font-bold text-gray-700 mb-3">تغییر وضعیت سفارش:</label>
                <div className="flex gap-3 flex-wrap">
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(order.id, status)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        order.status === status
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {getStatusLabel(status)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">سفارشی یافت نشد</h3>
            <p className="text-gray-600 mb-6">هیچ سفارشی با این فیلتر وجود ندارد</p>
            <button
              onClick={() => setFilter('all')}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              نمایش همه سفارشات
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
