import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, KeyRound, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, RefreshCw, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export const ForgotPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  // Step 1 = Enter Email, Step 2 = Enter & Verify OTP, Step 3 = Set New Password
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const navigate = useNavigate();

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

  // STEP 1: Request Password Reset OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please provide a valid registered email address.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await api.forgotPassword(cleanEmail);
      if (res.success) {
        setSuccessMsg(res.message);
        if (res.debugOtp) {
          setOtp(res.debugOtp);
        }
        setStep(2);
        startCooldown();
      }
    } catch (err) {
      setError(err.message || 'Unable to send password reset code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setSuccessMsg('');
    const cleanEmail = email.toLowerCase().trim();
    try {
      const res = await api.forgotPassword(cleanEmail);
      if (res.success) {
        setSuccessMsg(res.message || 'A fresh verification code was sent to your mailbox. Please check your latest email.');
        if (res.debugOtp) {
          setOtp(res.debugOtp);
        }
        startCooldown();
      }
    } catch (err) {
      setError(err.message || 'Error resending code.');
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    const cleanOtp = otp.replace(/\D/g, '').trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setError('Please enter the full 6-digit OTP code sent to your email.');
      return;
    }

    setLoading(true);
    const cleanEmail = email.toLowerCase().trim();
    try {
      const res = await api.verifyResetOTP(cleanEmail, cleanOtp);
      if (res.success) {
        setSuccessMsg('Code verified successfully! Now choose your new password.');
        setStep(3);
      }
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP code. Please enter the code from your latest email.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Set New Password
  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify and re-type.');
      return;
    }

    setLoading(true);
    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.replace(/\D/g, '').trim();

    try {
      const res = await api.resetPassword(cleanEmail, cleanOtp, newPassword);
      if (res.success) {
        setSuccessMsg('Password updated successfully! Redirecting you to login...');
        setTimeout(() => {
          navigate('/login');
        }, 1800);
      }
    } catch (err) {
      setError(err.message || 'Failed to update password. Please request a new code if expired.');
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
          <div className="w-10 h-10 rounded-full bg-spice-cream text-spice-crimson flex items-center justify-center mx-auto border border-spice-tan">
            {step === 3 ? <ShieldCheck className="w-5 h-5 text-green-700" /> : <KeyRound className="w-5 h-5" />}
          </div>
          <h1 className="font-serif font-bold text-2xl text-spice-brown">
            {step === 1 && 'Forgot Password?'}
            {step === 2 && 'Verify Mailbox Code'}
            {step === 3 && 'Create New Password'}
          </h1>
          <p className="text-xs text-spice-brown/70">
            {step === 1 && 'Enter your registered email address to receive a 6-digit recovery code.'}
            {step === 2 && `Enter the 6-digit code sent to your mailbox (${email})`}
            {step === 3 && 'Choose a secure new password for your Chilika Spices account.'}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-2 py-1">
          <div className={`h-1.5 rounded-full transition-all ${step >= 1 ? 'w-8 bg-spice-crimson' : 'w-4 bg-gray-200'}`} />
          <div className={`h-1.5 rounded-full transition-all ${step >= 2 ? 'w-8 bg-spice-crimson' : 'w-4 bg-gray-200'}`} />
          <div className={`h-1.5 rounded-full transition-all ${step >= 3 ? 'w-8 bg-spice-crimson' : 'w-4 bg-gray-200'}`} />
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-spice-brown mb-1.5">Registered Email Address</label>
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
              <span>{loading ? 'Sending Code to Mailbox...' : 'Send Recovery OTP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: Enter & Verify Mailbox OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3 bg-spice-cream rounded-2xl border border-spice-tan/60 flex items-center justify-between text-xs">
              <div className="truncate mr-2">
                <span className="text-[10px] text-spice-brown/60 block uppercase">Code delivered to:</span>
                <span className="font-bold text-spice-brown truncate block">{email}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setSuccessMsg('');
                  setStep(1);
                }}
                className="text-xs font-bold text-spice-crimson hover:underline shrink-0"
              >
                Change Email
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-spice-brown">6-Digit Mailbox Code *</label>
                <button
                  type="button"
                  disabled={resendCooldown > 0}
                  onClick={handleResend}
                  className="text-[11px] text-spice-crimson font-bold hover:underline disabled:text-gray-400 flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}</span>
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-spice-brown/40 absolute left-3.5 top-3" />
                <input
                  type="text"
                  maxLength={10}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  onPaste={(e) => {
                    const pasted = e.clipboardData.getData('text');
                    if (pasted) {
                      e.preventDefault();
                      setOtp(pasted.replace(/\D/g, '').slice(0, 6));
                    }
                  }}
                  placeholder="123456"
                  className="w-full bg-spice-cream border border-spice-tan rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-mono font-bold tracking-widest text-spice-brown focus:outline-none focus:border-spice-crimson text-center sm:text-left"
                />
              </div>
              <p className="text-[11px] text-spice-brown/60 mt-1">
                Open your email app to retrieve the code. If you requested multiple codes, enter the latest one.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.replace(/\D/g, '').length !== 6}
              className="w-full py-3 bg-spice-green hover:brightness-105 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-95"
            >
              <span>{loading ? 'Verifying Code...' : 'Verify OTP Code'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 3: Set New Password */}
        {step === 3 && (
          <form onSubmit={handleSetNewPassword} className="space-y-4">
            <div className="p-3 bg-green-50 border border-green-200 rounded-2xl flex items-center space-x-2.5 text-xs text-green-800">
              <ShieldCheck className="w-4 h-4 text-green-700 shrink-0" />
              <span>Identity authenticated for <strong>{email}</strong></span>
            </div>

            <div>
              <label className="block text-xs font-bold text-spice-brown mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-spice-brown/40 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-spice-cream border border-spice-tan rounded-xl pl-10 pr-10 py-2.5 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-spice-brown/50 hover:text-spice-brown"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-spice-brown mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-spice-brown/40 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full bg-spice-cream border border-spice-tan rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-spice-crimson hover:bg-spice-deepRed text-white rounded-xl text-xs font-bold shadow-spice transition-all flex items-center justify-center space-x-2 disabled:opacity-70 active:scale-95"
            >
              <span>{loading ? 'Updating Password...' : 'Save Password & Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Back navigation */}
        <div className="pt-2 border-t border-spice-tan/40 text-center">
          <Link
            to="/login"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-spice-brown/70 hover:text-spice-crimson"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
