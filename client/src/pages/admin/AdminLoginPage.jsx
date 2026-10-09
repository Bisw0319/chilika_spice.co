import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('admin@chilikaspices.com');
  const [password, setPassword] = useState('Admin@Chilika2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminLogin(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-spice-charcoal py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-spice-gold/40 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-spice-crimson text-white flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="font-serif font-bold text-2xl text-spice-brown">
            Chilika Admin Portal
          </h1>
          <p className="text-xs text-spice-brown/70">
            Secure back-office system for store management
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl space-y-2">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
            <p className="text-[11px] text-red-600/90 font-normal">
              Please verify the email has 'spices' plural (<span className="font-mono font-bold">admin@chilikaspices.com</span>) and the backend server is active.
            </p>
          </div>
        )}

        {/* Demo / Default Credentials Card */}
        <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl text-[11px] text-amber-900 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-950 flex items-center space-x-1">
              <span>Default Admin Credentials</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@chilikaspices.com');
                setPassword('Admin@Chilika2026');
                setError('');
              }}
              className="text-[10px] font-bold text-amber-800 bg-amber-200/70 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              Fill Defaults
            </button>
          </div>
          <p className="font-mono text-[10px] text-amber-800">
            Email: <span className="font-bold">admin@chilikaspices.com</span>
          </p>
          <p className="font-mono text-[10px] text-amber-800">
            Pass: <span className="font-bold">Admin@Chilika2026</span>
          </p>
        </div>

        <form onSubmit={handleAdminSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-spice-brown mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-spice-brown/40 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@chilikaspices.com"
                className="w-full bg-spice-cream border border-spice-tan rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-spice-brown mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-spice-brown/40 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin@Chilika2026"
                className="w-full bg-spice-cream border border-spice-tan rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-spice-crimson hover:bg-spice-deepRed text-white rounded-xl text-xs font-bold shadow-spice transition-all flex items-center justify-center space-x-2 disabled:opacity-70 active:scale-95 cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In as Administrator'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-spice-tan/40 text-center">
          <Link to="/" className="text-xs text-spice-brown/60 hover:text-spice-crimson">
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};
