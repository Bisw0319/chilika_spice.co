import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Mail, User, Phone, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, ShieldCheck, KeyRound, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  // Step 1: Form details, Step 2: Mailbox OTP Verification
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    email: emailParam,
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (emailParam) {
      setFormData((prev) => ({ ...prev, email: emailParam }));
    }
  }, [emailParam]);

  const startCooldown = () => {
    setResendTimer(45);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // STEP 1: Validate details and send OTP to real mailbox
  const handleProceedToOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.sendVerificationOTP(formData.email.trim());
      if (res.success) {
        setInfoMsg(res.message);
        setStep(2);
        startCooldown();
      }
    } catch (err) {
      setError(err.message || 'Could not dispatch verification code to this email.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setError('');
    setInfoMsg('');
    try {
      const res = await api.sendVerificationOTP(formData.email.trim());
      if (res.success) {
        setInfoMsg(res.message || 'A new 6-digit code was sent to your email.');
        startCooldown();
      }
    } catch (err) {
      setError(err.message || 'Error resending verification code.');
    }
  };

  // STEP 2: Verify OTP and create customer account
  const handleFinalRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        otp: otp.trim()
      });
      navigate('/account');
    } catch (err) {
      setError(err.message || 'Invalid verification code. Please check your mailbox.');
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
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h1 className="font-serif font-bold text-2xl text-spice-brown">
            {step === 1 ? 'Create Customer Account' : 'Verify Real Email'}
          </h1>
          <p className="text-xs text-spice-brown/70">
            {step === 1
              ? 'Enter your details below. We verify each email via OTP to keep our community authentic.'
              : `Check your mailbox (${formData.email}) for your 6-digit verification code`}
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Info Message */}
        {infoMsg && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{infoMsg}</span>
          </div>
        )}

        {/* STEP 1: Enter Registration Details */}
        {step === 1 && (
          <form onSubmit={handleProceedToOtp} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-spice-brown mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-spice-brown/40 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Subrat Das"
                  className="w-full bg-spice-cream border border-spice-tan rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-spice-brown mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-spice-brown/40 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full bg-spice-cream border border-spice-tan rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
                />
              </div>
              <p className="text-[10px] text-spice-brown/50 mt-1">
                Must be an active email account you can access.
              </p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-spice-brown mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-spice-brown/40 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="10-digit mobile number"
                  className="w-full bg-spice-cream border border-spice-tan rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-spice-brown mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-spice-brown/40 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className="w-full bg-spice-cream border border-spice-tan rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-spice-brown mb-1">Confirm Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-spice-brown/40 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repeat password"
                  className="w-full bg-spice-cream border border-spice-tan rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-spice-crimson hover:bg-spice-deepRed text-white rounded-xl text-xs font-bold shadow-spice transition-all flex items-center justify-center space-x-2 disabled:opacity-70 active:scale-95"
            >
              <span>{loading ? 'Verifying Email...' : 'Verify Real Email & Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: Enter OTP From Real Mailbox */}
        {step === 2 && (
          <form onSubmit={handleFinalRegister} className="space-y-4">
            <div className="p-3 bg-spice-cream rounded-2xl border border-spice-tan/60 flex items-center justify-between text-xs">
              <div className="truncate mr-2">
                <span className="text-[10px] text-spice-brown/60 block uppercase">Code sent to:</span>
                <span className="font-bold text-spice-brown truncate block">{formData.email}</span>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
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
                  disabled={resendTimer > 0}
                  onClick={handleResendOtp}
                  className="text-[11px] text-spice-crimson font-bold hover:underline disabled:text-gray-400 flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}</span>
                </button>
              </div>

              <div className="relative">
                <KeyRound className="w-4 h-4 text-spice-brown/40 absolute left-3.5 top-3" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full bg-spice-cream border border-spice-tan rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-mono font-bold tracking-widest text-spice-brown focus:outline-none focus:border-spice-crimson text-center sm:text-left"
                />
              </div>
              <p className="text-[11px] text-spice-brown/60 mt-1.5">
                Check your Gmail/email inbox (and spam folder) for the 6-digit code.
              </p>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-2.5 bg-spice-cream border border-spice-tan text-spice-brown rounded-xl text-xs font-bold hover:bg-spice-sand flex items-center justify-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-2/3 py-2.5 bg-spice-crimson hover:bg-spice-deepRed text-white rounded-xl text-xs font-bold shadow-spice transition-all flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-95"
              >
                <span>{loading ? 'Verifying...' : 'Complete Registration'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Alternate Navigation */}
        <div className="pt-2 border-t border-spice-tan/40 text-center text-xs text-spice-brown/80">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-spice-crimson hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
