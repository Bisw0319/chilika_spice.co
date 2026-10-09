import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  TicketPercent,
  FileEdit,
  MessageSquare,
  LogOut,
  Store,
  ShieldCheck,
  ShieldAlert,
  QrCode,
  Truck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-spice-cream flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-spice-tan shadow-lg max-w-md text-center space-y-4">
          <ShieldCheck className="w-12 h-12 text-spice-crimson mx-auto" />
          <h2 className="font-serif font-bold text-xl text-spice-brown">Admin Access Required</h2>
          <p className="text-xs text-spice-brown/70">
            Please log in with authorized administrator credentials to manage Chilika Spices.
          </p>
          <Link
            to="/admin/login"
            className="inline-block bg-spice-crimson text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-spice"
          >
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Coupons', path: '/admin/coupons', icon: TicketPercent },
    { name: 'Homepage Content', path: '/admin/homepage', icon: FileEdit },
    { name: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
    { name: 'Delivery & Offers', path: '/admin/delivery-offers', icon: Truck },
    { name: 'Payment & UPI', path: '/admin/payment-settings', icon: QrCode },
    { name: 'Security Audit', path: '/admin/audit-logs', icon: ShieldAlert }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-spice-charcoal text-spice-sand p-4 sm:p-6 shrink-0 flex flex-col justify-between">
        <div>
          {/* Logo Header */}
          <div className="flex items-center space-x-3 pb-6 border-b border-white/10 mb-6">
            <img
              src="/images/brand/chilika-logo.jpg"
              alt="Chilika Spices"
              className="h-10 w-auto rounded-md border border-spice-gold/40 shadow-xs"
            />
            <div>
              <span className="font-serif font-bold text-white text-sm block">CHILIKA ADMIN</span>
              <span className="text-[10px] text-spice-turmeric">Spice Brand Portal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-spice-crimson text-white shadow-xs font-bold'
                      : 'text-spice-sand/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-white/10 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center space-x-3 px-3 py-2 text-xs font-medium text-spice-turmeric hover:text-white transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>Visit Live Website ↗</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="w-full flex items-center space-x-3 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-white/5 rounded-xl transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Admin Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
