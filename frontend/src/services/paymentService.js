import { apiRequest } from './api';

const paymentService = {
  // ایجاد توکن پرداخت
  createPaymentToken: async (orderId) => {
    try {
      const response = await apiRequest.post(`/orders/orders/${orderId}/payment-token/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ارسال نتیجه پرداخت
  paymentCallback: async (token, refId, status) => {
    try {
      const response = await apiRequest.post('/orders/orders/payment-callback/', {
        token,
        ref_id: refId,
        status
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // هدایت به درگاه پرداخت
  redirectToGateway: (paymentUrl) => {
    window.location.href = paymentUrl;
  }
};

export default paymentService;
