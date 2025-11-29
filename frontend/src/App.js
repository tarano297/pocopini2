import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ErrorBoundary, ToastProvider, Navbar, Footer, LoadingSpinner } from './components';
import AdminRoute from './components/AdminRoute';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const ProductListing = lazy(() => import('./pages/ProductListing'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const PaymentCallback = lazy(() => import('./pages/PaymentCallback'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const AddressManagement = lazy(() => import('./pages/AddressManagement'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/AdminProducts'));
const AdminProductForm = lazy(() => import('./pages/AdminProductForm'));
const AdminOrders = lazy(() => import('./pages/AdminOrders'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const FAQ = lazy(() => import('./pages/FAQ'));

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <main className="flex-grow">
                  <Suspense fallback={
                    <div className="flex items-center justify-center min-h-screen">
                      <LoadingSpinner size="large" />
                    </div>
                  }>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<ProductListing />} />
                      <Route path="/products/:id" element={<ProductDetail />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/order-confirmation" element={<OrderConfirmation />} />
                      <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                      <Route path="/payment-callback" element={<PaymentCallback />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/profile/addresses" element={<AddressManagement />} />
                      <Route path="/order-tracking" element={<OrderTracking />} />
                      <Route path="/faq" element={<FAQ />} />
                      
                      {/* Admin Routes */}
                      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                      <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                      <Route path="/admin/products/new" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
                      <Route path="/admin/products/edit/:id" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
                      <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </div>
            </Router>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
