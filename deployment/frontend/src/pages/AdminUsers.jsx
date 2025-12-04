import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/accounts/users/');
      setUsers(response.data.results || response.data);
    } catch (error) {
      console.error('خطا در دریافت کاربران:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone_number?.includes(searchTerm)
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
      <h1 className="text-3xl font-bold mb-6">مدیریت کاربران</h1>

      {/* جستجو */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <input
          type="text"
          placeholder="جستجو بر اساس نام کاربری، ایمیل یا شماره تلفن..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      {/* آمار */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">کل کاربران</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">ادمین‌ها</p>
          <p className="text-2xl font-bold">{users.filter(u => u.is_staff).length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">کاربران فعال</p>
          <p className="text-2xl font-bold">{users.filter(u => u.is_active).length}</p>
        </div>
      </div>

      {/* لیست کاربران */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right">نام کاربری</th>
              <th className="px-6 py-3 text-right">ایمیل</th>
              <th className="px-6 py-3 text-right">شماره تلفن</th>
              <th className="px-6 py-3 text-right">تاریخ عضویت</th>
              <th className="px-6 py-3 text-right">نقش</th>
              <th className="px-6 py-3 text-right">وضعیت</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium">{user.username}</div>
                  {user.first_name && user.last_name && (
                    <div className="text-sm text-gray-500">
                      {user.first_name} {user.last_name}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">{user.email || '-'}</td>
                <td className="px-6 py-4">{user.phone_number || '-'}</td>
                <td className="px-6 py-4">
                  {new Date(user.date_joined || user.created_at).toLocaleDateString('fa-IR')}
                </td>
                <td className="px-6 py-4">
                  {user.is_superuser ? (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                      مدیر کل
                    </span>
                  ) : user.is_staff ? (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      ادمین
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                      کاربر
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.is_active ? 'فعال' : 'غیرفعال'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md mt-6">
          <p className="text-gray-500 text-lg">کاربری یافت نشد</p>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
