import { apiRequest } from './api';

const orderService = {
  // ثبت سفارش جدید
  createOrder: async (orderData) => {
    try {
      const response = await apiRequest.post('/orders/orders/', orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // دریافت لیست سفارشات کاربر
  getOrders: async (page = 1, pageSize = 10) => {
    try {
      const response = await apiRequest.get(`/orders/orders/?page=${page}&page_size=${pageSize}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // دریافت جزئیات یک سفارش
  getOrderById: async (orderId) => {
    try {
      const response = await apiRequest.get(`/orders/orders/${orderId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // لغو سفارش
  cancelOrder: async (orderId) => {
    try {
      const response = await apiRequest.patch(`/orders/orders/${orderId}/`, {
        status: 'cancelled'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // دریافت وضعیت‌های سفارش
  getOrderStatuses: () => {
    return [
      { value: 'pending', label: 'در انتظار', color: 'yellow' },
      { value: 'processing', label: 'در حال پردازش', color: 'blue' },
      { value: 'shipped', label: 'ارسال شده', color: 'purple' },
      { value: 'delivered', label: 'تحویل داده شده', color: 'green' },
      { value: 'cancelled', label: 'لغو شده', color: 'red' },
    ];
  },

  // دریافت رنگ وضعیت سفارش
  getStatusColor: (status) => {
    const statuses = orderService.getOrderStatuses();
    const statusObj = statuses.find(s => s.value === status);
    return statusObj ? statusObj.color : 'gray';
  },

  // دریافت برچسب وضعیت سفارش
  getStatusLabel: (status) => {
    const statuses = orderService.getOrderStatuses();
    const statusObj = statuses.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  },

  // محاسبه قیمت کل سفارش
  calculateOrderTotal: (orderItems) => {
    return orderItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  },

  // دریافت آمار سفارشات
  getOrderStats: async () => {
    try {
      const response = await apiRequest.get('/orders/stats/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // جستجو در سفارشات
  searchOrders: async (searchTerm, filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const queryString = params.toString();
      const url = queryString ? `/orders/?${queryString}` : '/orders/';
      
      const response = await apiRequest.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // دریافت فاکتور سفارش
  getOrderInvoice: async (orderId) => {
    try {
      const response = await apiRequest.get(`/orders/${orderId}/invoice/`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ردیابی سفارش
  trackOrder: async (orderId) => {
    try {
      const response = await apiRequest.get(`/orders/${orderId}/track/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // تایید دریافت سفارش
  confirmDelivery: async (orderId) => {
    try {
      const response = await apiRequest.patch(`/orders/${orderId}/confirm-delivery/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // درخواست مرجوعی
  requestReturn: async (orderId, returnData) => {
    try {
      const response = await apiRequest.post(`/orders/${orderId}/return/`, returnData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default orderService;