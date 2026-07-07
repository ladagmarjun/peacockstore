import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SettingsProvider } from './context/SettingsContext';

import HomePage              from './pages/HomePage';
import CheckoutPage          from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import LoginPage             from './pages/LoginPage';
import RegisterPage          from './pages/RegisterPage';

import DashboardPage    from './pages/admin/DashboardPage';
import ProductsPage     from './pages/admin/ProductsPage';
import ProductFormPage  from './pages/admin/ProductFormPage';
import CategoriesPage   from './pages/admin/CategoriesPage';
import BrandsPage       from './pages/admin/BrandsPage';
import StoresPage       from './pages/admin/StoresPage';
import BannersPage      from './pages/admin/BannersPage';
import OrdersPage       from './pages/admin/OrdersPage';
import OrderDetailPage  from './pages/admin/OrderDetailPage';
import UsersPage        from './pages/admin/UsersPage';
import SettingsPage     from './pages/admin/SettingsPage';

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading…</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
  return children;
}

function AuthRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading…</div>;
  if (user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
      <CartProvider>
        <Routes>
          {/* Public */}
          <Route path="/"            element={<HomePage />} />
          <Route path="/checkout"    element={<CheckoutPage />} />
          <Route path="/orders/:id/confirmation" element={<OrderConfirmationPage />} />
          <Route path="/login"       element={<AuthRoute><LoginPage /></AuthRoute>} />
          <Route path="/register"    element={<AuthRoute><RegisterPage /></AuthRoute>} />

          {/* Admin */}
          <Route path="/admin"                   element={<AdminRoute><DashboardPage /></AdminRoute>} />
          <Route path="/admin/products"          element={<AdminRoute><ProductsPage /></AdminRoute>} />
          <Route path="/admin/products/new"      element={<AdminRoute><ProductFormPage /></AdminRoute>} />
          <Route path="/admin/products/:id/edit" element={<AdminRoute><ProductFormPage /></AdminRoute>} />
          <Route path="/admin/categories"        element={<AdminRoute><CategoriesPage /></AdminRoute>} />
          <Route path="/admin/brands"            element={<AdminRoute><BrandsPage /></AdminRoute>} />
          <Route path="/admin/stores"            element={<AdminRoute><StoresPage /></AdminRoute>} />
          <Route path="/admin/banners"           element={<AdminRoute><BannersPage /></AdminRoute>} />
          <Route path="/admin/orders"            element={<AdminRoute><OrdersPage /></AdminRoute>} />
          <Route path="/admin/orders/:id"        element={<AdminRoute><OrderDetailPage /></AdminRoute>} />
          <Route path="/admin/users"             element={<AdminRoute><UsersPage /></AdminRoute>} />
          <Route path="/admin/settings"          element={<AdminRoute><SettingsPage /></AdminRoute>} />
        </Routes>
      </CartProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
