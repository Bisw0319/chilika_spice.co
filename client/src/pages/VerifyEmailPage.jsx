import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Mail, CheckCircle2, AlertCircle, KeyRound, ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || 'freelixir.b@gmail.com';

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = Request, 2 = Enter OTP, 3 = Verified
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const startCooldown = () => {
    setResendCooldown(45);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await api.sendVerificationOTP(email.trim());
      if (res.success) {
        setSuccessMsg(res.message);
        setStep(2);
        startCooldown();
      }
    } catch (err) {
      setError(err.message || 'Error sending verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP code');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await api.verifyEmailOTP(email.trim(), otp.trim());
      if (res.success) {
        setStep(3);
        setSuccessMsg('Your email address has been verified successfully!');
      }
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-spice-cream py-12 sm:py-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-10 border border-spice-tan/60 shadow-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <img
              src="/images/brand/chilika-logo.jpg"
              alt="Chilika Spices"
              className="h-12 w-auto mx-auto object-contain rounded-md border border-spice-gold/50 shadow-xs"
            />
          </Link>
          <div className="w-10 h-10 rounded-full bg-green-50 text-green-700 flex items-center justify-center mx-auto border border-green-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h1 className="font-serif font-bold text-2xl text-spice-brown">
            Email Verification
          </h1>
          <p className="text-xs text-spice-brown/70">
            Verify valid email ownership with a 6-digit one-time passcode
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && step !== 3 && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}



        {/* STEP 1: Request OTP */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-spice-brown mb-1.5">Email Address to Verify</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-spice-brown/40 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. freelixir.b@gmail.com"
                  className="w-full bg-spice-cream border border-spice-tan rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-spice-crimson hover:bg-spice-deepRed text-white rounded-xl text-xs font-bold shadow-spice transition-all flex items-center justify-center space-x-2 disabled:opacity-70 active:scale-95"
            >
              <span>{loading ? 'Dispatching OTP...' : 'Send Verification OTP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: Submit OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-spice-brown">6-Digit Code for {email}</label>
                <button
                  type="button"
                  disabled={resendCooldown > 0}
                  onClick={handleSendOtp}
                  className="text-[11px] text-spice-crimson font-bold hover:underline disabled:text-gray-400 flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend'}</span>
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-spice-brown/40 absolute left-3.5 top-3" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full bg-spice-cream border border-spice-tan rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-mono font-bold tracking-widest text-spice-brown focus:outline-none focus:border-spice-crimson text-center sm:text-left"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-spice-green hover:brightness-105 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-70 active:scale-95"
            >
              <span>{loading ? 'Verifying...' : 'Verify Email Code'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 3: Successfully Verified */}
        {step === 3 && (
          <div className="text-center space-y-4 py-2">
            <div className="w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-spice-brown">Email Verified!</h3>
              <p className="text-xs text-spice-brown/70 mt-1">
                <strong>{email}</strong> has been authenticated and verified as a valid email address.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                to={`/register?email=${encodeURIComponent(email)}`}
                className="w-full py-2.5 bg-spice-crimson hover:bg-spice-deepRed text-white rounded-xl text-xs font-bold shadow-xs text-center"
              >
                Create Account With This Email
              </Link>
              <Link
                to="/login"
                className="w-full py-2.5 bg-spice-cream border border-spice-tan text-spice-brown rounded-xl text-xs font-bold text-center hover:bg-spice-sand"
              >
                Proceed to Login
              </Link>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-2 border-t border-spice-tan/40 text-center text-xs text-spice-brown/70">
          Already verified?{' '}
          <Link to="/login" className="font-bold text-spice-crimson hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
