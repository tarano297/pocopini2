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
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">مدیریت سفارشات</h1>

      {/* فیلتر */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}
          >
            همه ({orders.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
          >
            در انتظار ({orders.filter(o => o.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('processing')}
            className={`px-4 py-2 rounded ${filter === 'processing' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            در حال پردازش ({orders.filter(o => o.status === 'processing').length})
          </button>
          <button
            onClick={() => setFilter('shipped')}
            className={`px-4 py-2 rounded ${filter === 'shipped' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
          >
            ارسال شده ({orders.filter(o => o.status === 'shipped').length})
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`px-4 py-2 rounded ${filter === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            تحویل داده شده ({orders.filter(o => o.status === 'delivered').length})
          </button>
        </div>
      </div>

      {/* لیست سفارشات */}
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">سفارش #{order.id}</h3>
                <p className="text-gray-600">کاربر: {order.user?.username || order.user}</p>
                <p className="text-gray-600">تاریخ: {new Date(order.created_at).toLocaleDateString('fa-IR')}</p>
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-pink-600">
                  {order.total_price?.toLocaleString()} تومان
                </p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
            </div>

            {/* آیتم‌های سفارش */}
            {order.items && order.items.length > 0 && (
              <div className="border-t pt-4 mb-4">
                <h4 className="font-bold mb-2">محصولات:</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.product?.name || item.product} × {item.quantity}</span>
                      <span>{(item.price * item.quantity).toLocaleString()} تومان</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* تغییر وضعیت */}
            <div className="border-t pt-4">
              <label className="block text-sm font-bold mb-2">تغییر وضعیت:</label>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className="w-full md:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="pending">در انتظار</option>
                <option value="processing">در حال پردازش</option>
                <option value="shipped">ارسال شده</option>
                <option value="delivered">تحویل داده شده</option>
                <option value="cancelled">لغو شده</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-lg">سفارشی یافت نشد</p>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
