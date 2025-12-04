import React, { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  if (!user.is_staff) {
    return <Navigate to="/" replace />;
  }

  const menuItems = [
    { path: '/admin', icon: '🎯', label: 'داشبورد', exact: true },
    { path: '/admin/products', icon: '🛍️', label: 'محصولات' },
    { path: '/admin/orders', icon: '📦', label: 'سفارشات' },
    { path: '/admin/users', icon: '👥', label: 'کاربران' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-purple-600 via-pink-600 to-purple-700 text-white transition-all duration-300 fixed h-screen z-50 shadow-2xl`}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            {sidebarOpen && (
              <h2 className="text-2xl font-bold">پنل مدیریت</h2>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive(item.path, item.exact)
                    ? 'bg-white text-purple-600 shadow-lg scale-105'
                    : 'hover:bg-white/20'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                {sidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Back to Site */}
          {sidebarOpen && (
            <div className="mt-8 pt-8 border-t border-white/20">
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/20 transition-colors"
              >
                <span className="text-2xl">🏠</span>
                <span className="font-medium">بازگشت به سایت</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? 'mr-64' : 'mr-20'} transition-all duration-300`}>
        {children}
      </main>
    </div>
  );
};

export default AdminRoute;
