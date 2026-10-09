import React, { useState } from 'react';
import { Mail, Check, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, success: '', error: '' });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus({ loading: false, success: '', error: 'Please enter a valid email address.' });
      return;
    }

    try {
      setStatus({ loading: true, success: '', error: '' });
      const res = await api.subscribeNewsletter(email);
      setStatus({ loading: false, success: res.message || 'Subscribed successfully!', error: '' });
      setEmail('');
    } catch (err) {
      setStatus({ loading: false, success: '', error: err.message || 'Failed to subscribe. Please try again.' });
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-r from-spice-crimson to-spice-deepRed text-white relative overflow-hidden">
      {/* Subtle background ornament */}
      <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <span className="text-xs font-bold text-spice-turmeric uppercase tracking-widest block mb-2">
          Stay Connected
        </span>
        <h2 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight">
          Bring the taste of tradition home.
        </h2>
        <p className="text-xs sm:text-sm text-spice-sand/80 max-w-lg mx-auto mt-2 leading-relaxed">
          Join our spice community to receive fresh batch announcements, traditional Odia recipes, and seasonal harvesting stories.
        </p>

        <form onSubmit={handleSubscribe} className="mt-6 max-w-md mx-auto flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Mail className="w-4 h-4 text-spice-brown/40 absolute left-3.5 top-3.5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full bg-white text-spice-brown placeholder-spice-brown/50 pl-10 pr-4 py-3 rounded-xl sm:rounded-l-xl sm:rounded-r-none text-sm focus:outline-none focus:ring-2 focus:ring-spice-turmeric shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={status.loading}
            className="bg-spice-turmeric hover:bg-spice-yellow text-spice-brown font-bold text-sm px-6 py-3 rounded-xl sm:rounded-r-xl sm:rounded-l-none transition-colors shadow-md disabled:opacity-70 whitespace-nowrap"
          >
            {status.loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {status.success && (
          <div className="mt-3 inline-flex items-center text-xs font-semibold text-spice-lightGreen bg-spice-forest/60 px-3.5 py-1.5 rounded-full">
            <Check className="w-3.5 h-3.5 mr-1.5" />
            <span>{status.success}</span>
          </div>
        )}

        {status.error && (
          <div className="mt-3 inline-flex items-center text-xs font-semibold text-rose-200 bg-red-900/60 px-3.5 py-1.5 rounded-full">
            <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
            <span>{status.error}</span>
          </div>
        )}
      </div>
    </section>
  );
};
