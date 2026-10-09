import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-spice-cream py-12 sm:py-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-10 border border-spice-tan/60 shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <img
              src="/images/brand/chilika-logo.jpg"
              alt="Chilika Spices"
              className="h-12 w-auto mx-auto object-contain rounded-md border border-spice-gold/50 shadow-xs"
            />
          </Link>
          <h1 className="font-serif font-bold text-2xl text-spice-brown">
            Customer Login
          </h1>
          <p className="text-xs text-spice-brown/70">
            Welcome back to your Chilika spice pantry
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-spice-brown mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-spice-brown/40 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-spice-cream border border-spice-tan rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-spice-brown">Password</label>
              <Link
                to="/forgot-password"
                className="text-[11px] font-bold text-spice-crimson hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-spice-brown/40 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-spice-cream border border-spice-tan rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-spice-crimson hover:bg-spice-deepRed text-white rounded-xl text-xs font-bold shadow-spice transition-all flex items-center justify-center space-x-2 disabled:opacity-70 active:scale-95"
          >
            <span>{loading ? 'Logging in...' : 'Sign In to Your Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-spice-tan/40 text-center text-xs text-spice-brown/80 space-y-3">
          <p>
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-spice-crimson hover:underline">
              Create an account
            </Link>
          </p>

          <div className="p-2.5 bg-spice-sand/50 rounded-xl text-[11px] text-spice-brown/70 flex items-center justify-between">
            <span>Demo Customer:</span>
            <button
              type="button"
              onClick={() => {
                setEmail('priya.sharma@example.com');
                setPassword('Customer@123');
              }}
              className="text-spice-crimson font-bold hover:underline"
            >
              Fill Demo Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
