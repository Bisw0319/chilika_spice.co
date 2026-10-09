import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AddressProvider } from './context/AddressContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ContentProvider } from './context/ContentContext';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Common
import { SpicePreloader } from './components/common/SpicePreloader';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { AccountPage } from './pages/AccountPage';
import { OrdersPage } from './pages/OrdersPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import {
  PrivacyPolicyPage,
  TermsPage,
  ShippingPolicyPage,
  ReturnPolicyPage
} from './pages/PolicyPages';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { AdminHomepagePage } from './pages/admin/AdminHomepagePage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminPaymentSettingsPage } from './pages/admin/AdminPaymentSettingsPage';
import { AdminShippingOffersPage } from './pages/admin/AdminShippingOffersPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';

export function App() {
  return (
    <Router>
      <SpicePreloader />
      <AuthProvider>
        <AddressProvider>
          <ContentProvider>
            <CartProvider>
              <WishlistProvider>
                <Routes>
                {/* Public Storefront Routes */}
                <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/track-order" element={<TrackOrderPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-conditions" element={<TermsPage />} />
                <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
                <Route path="/refund-policy" element={<ReturnPolicyPage />} />
              </Route>

              {/* Admin Portal Authentication */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Protected Admin Suite Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="customers" element={<AdminCustomersPage />} />
                <Route path="coupons" element={<AdminCouponsPage />} />
                <Route path="homepage" element={<AdminHomepagePage />} />
                <Route path="reviews" element={<AdminReviewsPage />} />
                <Route path="payment-settings" element={<AdminPaymentSettingsPage />} />
                <Route path="delivery-offers" element={<AdminShippingOffersPage />} />
                <Route path="audit-logs" element={<AdminAuditLogsPage />} />
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </ContentProvider>
      </AddressProvider>
    </AuthProvider>
  </Router>
  );
}

export default App;
