import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoadingSpinner, ProtectedRoute } from '../components';
import paymentService from '../services/paymentService';

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [message, setMessage] = useState('در حال پردازش پرداخت...');

  useEffect(() => {
    processPayment();
  }, []);

  const processPayment = async () => {
    try {
      const token = searchParams.get('token');
      const refId = searchParams.get('ref_id');
      const status = searchParams.get('status');

      if (!token) {
        setMessage('اطلاعات پرداخت ناقص است');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      // ارسال نتیجه به سرور
      const result = await paymentService.paymentCallback(token, refId, status);

      if (result.order_id) {
        // پرداخت موفق
        setTimeout(() => {
          navigate(`/order-success/${result.order_id}`, { replace: true });
        }, 2000);
      } else {
        // پرداخت ناموفق
        setMessage('پرداخت ناموفق بود');
        setTimeout(() => navigate('/'), 3000);
      }
    } catch (error) {
      console.error('Payment callback error:', error);
      setMessage('خطا در پردازش پرداخت');
      setTimeout(() => navigate('/'), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          {isProcessing && <LoadingSpinner size="large" />}
          <p className="mt-4 text-lg text-gray-700">{message}</p>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PaymentCallback;
