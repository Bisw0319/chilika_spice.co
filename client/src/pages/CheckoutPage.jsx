import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Truck,
  CreditCard,
  Banknote,
  Lock,
  ArrowRight,
  ChevronLeft,
  PackageCheck,
  MessageCircle,
  Copy,
  Check,
  Sparkles,
  QrCode,
  Printer,
  FileText,
  AlertCircle,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useAddress } from '../context/AddressContext';
import { api } from '../services/api';
import { UpiPaymentPanel } from '../components/checkout/UpiPaymentPanel';
import { CustomerInvoiceModal } from '../components/invoice/CustomerInvoiceModal';

export const CheckoutPage = () => {
  const { cartItems, subtotal, shippingFee, discount, finalTotal, coupon, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { defaultAddress, saveDefaultAddress } = useAddress();
  const navigate = useNavigate();

  // 4-Step checkout progress: 1 (Address), 2 (Delivery/Review), 3 (Payment), 4 (Confirmed)
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [saveAsDefault, setSaveAsDefault] = useState(true);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Payment Configuration & UTR State
  const [paymentConfig, setPaymentConfig] = useState({
    upiId: '9124160550@ybl',
    payeeName: 'Chilika Spices',
    phone: '9124160550',
    isUpiEnabled: true,
    isCodEnabled: true,
    qrCustomNote: 'Chilika Spices Fresh Order'
  });
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [copiedUtr, setCopiedUtr] = useState(false);

  useEffect(() => {
    api.getPaymentConfig()
      .then((res) => {
        if (res.success && res.config) {
          setPaymentConfig(res.config);
        }
      })
      .catch((err) => {
        console.warn('Could not load remote payment config, using defaults:', err);
      });
  }, []);

  // Form State - Pre-fills from defaultAddress or logged in user
  const [formData, setFormData] = useState({
    fullName: defaultAddress?.fullName || user?.name || '',
    email: user?.email || '',
    phone: defaultAddress?.phone || user?.phone || '',
    street: defaultAddress?.street || user?.addresses?.[0]?.street || '',
    city: defaultAddress?.city || user?.addresses?.[0]?.city || 'Bhubaneswar',
    state: defaultAddress?.state || user?.addresses?.[0]?.state || 'Odisha',
    pincode: defaultAddress?.pincode || user?.addresses?.[0]?.pincode || '',
    paymentMethod: 'upi' // Default recommended 0% fee: 'upi' | 'cod' | 'whatsapp'
  });

  const [pincodeValidating, setPincodeValidating] = useState(false);
  const [pincodeStatus, setPincodeStatus] = useState('');
  const [isPincodeServiceable, setIsPincodeServiceable] = useState(true);
  const [pincodeDeliveryInfo, setPincodeDeliveryInfo] = useState(null);

  // Validate pincode serviceability against admin panel rules
  const verifyCheckoutPincode = async (val) => {
    if (val.length !== 6 || !/^\d{6}$/.test(val)) {
      setPincodeStatus('');
      setIsPincodeServiceable(true);
      setPincodeDeliveryInfo(null);
      return;
    }
    setPincodeValidating(true);
    try {
      const res = await api.checkPincodeServiceability(val);
      if (res.success) {
        setIsPincodeServiceable(res.isServiceable);
        setPincodeStatus(res.message);
        setPincodeDeliveryInfo(res);
      }
    } catch (err) {
      console.warn('Checkout pincode check error:', err);
      setIsPincodeServiceable(true);
      setPincodeStatus('✓ Express courier delivery available');
    } finally {
      setPincodeValidating(false);
    }
  };

  // Keep synced if defaultAddress loads later
  useEffect(() => {
    if (defaultAddress) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || defaultAddress.fullName || '',
        phone: prev.phone || defaultAddress.phone || '',
        street: prev.street || defaultAddress.street || '',
        city: prev.city || defaultAddress.city || 'Bhubaneswar',
        state: prev.state || defaultAddress.state || 'Odisha',
        pincode: prev.pincode || defaultAddress.pincode || ''
      }));
      if (defaultAddress.pincode && defaultAddress.pincode.length === 6) {
        verifyCheckoutPincode(defaultAddress.pincode);
      }
    }
  }, [defaultAddress]);

  // Pincode validation architecture
  const handlePincodeChange = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: clean }));
    if (clean.length === 6) {
      if (clean.startsWith('75') || clean.startsWith('76')) {
        setFormData((prev) => ({ ...prev, state: 'Odisha' }));
      }
      verifyCheckoutPincode(clean);
    } else {
      setPincodeStatus('');
      setIsPincodeServiceable(true);
      setPincodeDeliveryInfo(null);
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email || !formData.street || formData.pincode.length !== 6) {
      setErrorMessage('Please fill in all mandatory address fields with a valid 6-digit PIN.');
      return;
    }
    if (!isPincodeServiceable) {
      setErrorMessage(pincodeStatus || 'Delivery is currently not available for this pincode.');
      return;
    }
    if (saveAsDefault) {
      saveDefaultAddress(formData);
    }
    setErrorMessage('');
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    // Validate 12-digit UTR if UPI is selected
    if (formData.paymentMethod === 'upi') {
      const cleanUtr = utrNumber.trim();
      if (!cleanUtr || cleanUtr.length !== 12 || !/^\d{12}$/.test(cleanUtr)) {
        setErrorMessage('Please enter the valid 12-digit UPI Reference / UTR Number from your payment app receipt before confirming.');
        return;
      }
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const orderPayload = {
        items: cartItems,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          street: formData.street,
          city: formData.city || 'Local',
          state: formData.state,
          pincode: formData.pincode,
          country: 'India'
        },
        paymentMethod: formData.paymentMethod,
        paymentDetails: formData.paymentMethod === 'upi' ? {
          upiId: paymentConfig.upiId,
          utrNumber: utrNumber.trim(),
          paymentScreenshot: screenshotUrl
        } : {},
        couponCode: coupon?.code
      };

      const res = await api.createOrder(orderPayload);
      if (res.success && res.order) {
        setOrderResult(res.order);
        setStep(4);
        clearCart();

        // Celebration Confetti!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        setErrorMessage(res.message || 'Unable to place order. Please try again.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Payment processing error.');
    } finally {
      setSubmitting(false);
    }
  };

  // Strictly require user login before proceeding to order
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-spice-cream py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-spice-tan/60 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-spice-crimson/10 text-spice-crimson flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-spice-turmeric uppercase tracking-widest block mb-1">
              Secure Checkout
            </span>
            <h2 className="font-serif font-bold text-2xl text-spice-brown">
              Login Required To Order
            </h2>
            <p className="text-xs sm:text-sm text-spice-brown/70 mt-2 leading-relaxed">
              To guarantee seamless order dispatch, verified tax invoice generation, and doorstep parcel tracking, please log in or create an account.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              to="/login?redirect=/checkout"
              className="w-full flex items-center justify-center space-x-2 py-3.5 bg-spice-crimson hover:bg-spice-deepRed text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-all active:scale-95"
            >
              <span>Log In & Continue Order</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register?redirect=/checkout"
              className="w-full block py-3 bg-spice-sand/70 hover:bg-spice-tan text-spice-brown text-xs sm:text-sm font-bold rounded-2xl transition-all border border-spice-tan"
            >
              New Customer? Create Account
            </Link>
          </div>

          <p className="text-[11px] text-spice-brown/50 pt-1">
            🔒 100% Protected Checkout • Chilika Spices Odisha
          </p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && step !== 4) {
    return (
      <div className="min-h-screen bg-spice-cream py-16 text-center">
        <h2 className="font-serif font-bold text-2xl text-spice-brown mb-2">No items to checkout</h2>
        <Link to="/shop" className="text-xs font-bold text-spice-crimson underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  // STEP 4: Order Confirmed Screen
  if (step === 4 && orderResult) {
    return (
      <div className="min-h-screen bg-spice-cream py-10 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-spice-tan/60 shadow-lg space-y-6">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-spice-turmeric uppercase tracking-widest">
                Order Confirmed
              </span>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-spice-brown">
                Dhanyabad! Thank you for ordering.
              </h1>
              <p className="text-xs sm:text-sm text-spice-brown/70 max-w-md mx-auto pt-1">
                Your fresh Odisha spice package is being prepared with pure village heritage and will be dispatched soon.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-spice-cream p-5 rounded-2xl border border-spice-tan/50 text-left space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-spice-tan/40">
                <div>
                  <span className="text-[11px] text-spice-brown/60 block">Order ID</span>
                  <span className="font-mono font-bold text-sm sm:text-base text-spice-crimson">
                    {orderResult.orderId}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-spice-brown/60 block">Amount</span>
                  <span className="font-serif font-bold text-base sm:text-lg text-spice-brown">
                    ₹{orderResult.total}
                  </span>
                </div>
              </div>

              <div className="text-xs text-spice-brown/80 space-y-1">
                <p><strong>Deliver to:</strong> {orderResult.shippingAddress.fullName} ({orderResult.shippingAddress.phone})</p>
                <p><strong>Address:</strong> {orderResult.shippingAddress.street}, {orderResult.shippingAddress.city} - {orderResult.shippingAddress.pincode}</p>
                <p>
                  <strong>Payment Mode:</strong>{' '}
                  <span className="uppercase font-bold text-spice-crimson">
                    {orderResult.paymentMethod === 'upi' ? 'Direct UPI Transfer' : orderResult.paymentMethod.toUpperCase()}
                  </span>
                </p>
                <p><strong>Estimated Delivery:</strong> 4–5 business days</p>
              </div>
            </div>

            {/* UPI Payment Status Card */}
            {orderResult.paymentMethod === 'upi' && (
              <div className="bg-amber-50 p-4 sm:p-5 rounded-2xl border border-amber-200 text-left space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>UPI Reference Recorded</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                    Verification Pending
                  </span>
                </div>
                <div className="text-xs text-amber-900 space-y-1">
                  <p>
                    <strong>Submitted UTR:</strong>{' '}
                    <span className="font-mono font-bold text-spice-crimson tracking-wider bg-white px-2 py-0.5 rounded border border-amber-300">
                      {orderResult.paymentDetails?.utrNumber || utrNumber}
                    </span>
                  </p>
                  <p className="text-[11px] text-amber-800 pt-0.5">
                    ✓ Your payment reference is saved. The Chilika Spices team verifies bank credits promptly and will update your order to Confirmed status.
                  </p>
                </div>

                <a
                  href={`https://wa.me/919668659633?text=${encodeURIComponent(
                    `Namaste Chilika Spices! I have placed Order ${orderResult.orderId} of ₹${orderResult.total} via UPI with UTR: ${orderResult.paymentDetails?.utrNumber || utrNumber}. Please confirm my order!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-full py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center space-x-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Notify Chilika Spices on WhatsApp (+91 96686 59633)</span>
                </a>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowInvoiceModal(true)}
                className="w-full py-3 bg-spice-crimson hover:bg-spice-deepRed text-white rounded-xl text-xs font-bold shadow-spice flex items-center justify-center space-x-2 transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>View / Print Customer Tax Invoice</span>
              </button>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <Link
                  to={`/track-order?orderId=${orderResult.orderId}&phone=${encodeURIComponent(orderResult.shippingAddress.phone)}`}
                  className="w-full sm:w-1/2 py-2.5 bg-spice-sand text-spice-brown hover:bg-spice-tan/50 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all border border-spice-tan"
                >
                  <Truck className="w-4 h-4 text-spice-crimson" />
                  <span>Track Live Order</span>
                </Link>
                <Link
                  to="/"
                  className="w-full sm:w-1/2 py-2.5 bg-white border border-spice-tan text-spice-brown hover:bg-spice-sand rounded-xl text-xs font-bold text-center transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>

            {/* Customer Invoice Modal */}
            <CustomerInvoiceModal
              order={orderResult}
              isOpen={showInvoiceModal}
              onClose={() => setShowInvoiceModal(false)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spice-cream py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Indicator Header */}
        <div className="mb-8">
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-spice-brown mb-4">
            Secure Checkout
          </h1>
          <div className="flex items-center space-x-4 max-w-md text-xs font-bold">
            <div className={`flex items-center space-x-1.5 ${step >= 1 ? 'text-spice-crimson' : 'text-gray-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${step >= 1 ? 'bg-spice-crimson' : 'bg-gray-300'}`}>
                1
              </span>
              <span>Address</span>
            </div>
            <span className="text-gray-300">——</span>
            <div className={`flex items-center space-x-1.5 ${step >= 2 ? 'text-spice-crimson' : 'text-gray-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${step >= 2 ? 'bg-spice-crimson' : 'bg-gray-300'}`}>
                2
              </span>
              <span>Delivery & Payment</span>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Step Left Column */}
          <div className="lg:col-span-7">
            {step === 1 && (
              <form onSubmit={handleAddressSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-spice-tan/60 shadow-sm space-y-4">
                <h2 className="font-serif font-bold text-lg text-spice-brown pb-2 border-b border-spice-tan/40">
                  Step 1: Shipping Address
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-spice-brown mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Ramesh Mohanty"
                      className="w-full bg-spice-cream border border-spice-tan rounded-xl px-3.5 py-2.5 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-spice-brown mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="10-digit mobile number"
                      className="w-full bg-spice-cream border border-spice-tan rounded-xl px-3.5 py-2.5 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-spice-brown mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="For order receipt and updates"
                    className="w-full bg-spice-cream border border-spice-tan rounded-xl px-3.5 py-2.5 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-spice-brown mb-1">Street Address / House No. / Landmark *</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="House/Flat number, building name, street, nearby landmark"
                    className="w-full bg-spice-cream border border-spice-tan rounded-xl px-3.5 py-2.5 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-spice-brown mb-1">Pincode *</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={formData.pincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      placeholder="6-digit PIN"
                      className="w-full bg-spice-cream border border-spice-tan rounded-xl px-3.5 py-2.5 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
                    />
                    {pincodeValidating && (
                      <span className="text-[10px] text-spice-brown/70 font-semibold mt-1 flex items-center space-x-1 animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin text-spice-turmeric" />
                        <span>Checking availability...</span>
                      </span>
                    )}
                    {!pincodeValidating && pincodeStatus && (
                      isPincodeServiceable ? (
                        <span className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{pincodeStatus}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-red-600 font-bold mt-1 flex items-center space-x-1 bg-red-50 p-1 rounded border border-red-200">
                          <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                          <span>{pincodeStatus}</span>
                        </span>
                      )
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-spice-brown mb-1">City / Town *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Bhubaneswar"
                      className="w-full bg-spice-cream border border-spice-tan rounded-xl px-3.5 py-2.5 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-spice-brown mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="e.g. Odisha"
                      className="w-full bg-spice-cream border border-spice-tan rounded-xl px-3.5 py-2.5 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
                    />
                  </div>
                </div>

                {/* Save as default address checkbox */}
                <div className="pt-1">
                  <label className="flex items-center space-x-2 text-xs font-semibold text-spice-brown cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={saveAsDefault}
                      onChange={(e) => setSaveAsDefault(e.target.checked)}
                      className="w-4 h-4 rounded text-spice-crimson focus:ring-spice-crimson border-spice-tan"
                    />
                    <span>Set this as my default delivery address</span>
                  </label>
                  {defaultAddress && (
                    <span className="text-[10px] text-spice-brown/60 block mt-0.5 ml-6">
                      ✓ Pre-filled from your saved default location
                    </span>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={pincodeValidating || (!isPincodeServiceable && formData.pincode.length === 6)}
                    className={`flex items-center space-x-2 py-3 px-8 rounded-2xl text-xs font-bold shadow-spice transition-all ${
                      (!isPincodeServiceable && formData.pincode.length === 6)
                        ? 'bg-gray-400 text-white cursor-not-allowed opacity-75'
                        : 'bg-spice-crimson hover:bg-spice-deepRed text-white'
                    }`}
                  >
                    <span>Continue to Delivery & Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-spice-tan/60 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-spice-tan/40">
                  <h2 className="font-serif font-bold text-lg text-spice-brown">
                    Step 2: Delivery & Payment Options
                  </h2>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-spice-crimson flex items-center space-x-1 hover:underline"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Edit Address</span>
                  </button>
                </div>

                {/* Delivery Review */}
                <div className="bg-spice-cream p-4 rounded-2xl border border-spice-tan/40 text-xs text-spice-brown space-y-1">
                  <p><strong>Deliver to:</strong> {formData.fullName} ({formData.phone})</p>
                  <p><strong>Address:</strong> {formData.street}, {formData.city}, {formData.state} - {formData.pincode}</p>
                  <p className="text-spice-green font-semibold pt-1">
                    ✓ Express Courier Dispatch from Odisha within 24 Hours
                  </p>
                </div>

                {/* Payment Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-spice-brown mb-3">
                    Choose Payment Method:
                  </label>
                  <div className="space-y-4">
                    {/* 1. Direct UPI Payment (0% Fee) */}
                    <div
                      className={`rounded-2xl border transition-all ${
                        formData.paymentMethod === 'upi'
                          ? 'border-spice-crimson bg-spice-cream/40 shadow-xs'
                          : 'border-spice-tan/60 hover:bg-spice-sand/30 bg-white'
                      }`}
                    >
                      <label className="flex items-start p-4 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="upi"
                          checked={formData.paymentMethod === 'upi'}
                          onChange={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                          className="mt-1 text-spice-crimson focus:ring-spice-crimson"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <span className="font-serif font-bold text-sm text-spice-brown flex items-center space-x-2">
                              <QrCode className="w-4 h-4 text-spice-crimson" />
                              <span>Instant UPI (GPay / PhonePe / Paytm / BHIM)</span>
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                              0% Fee • Instant Bank Transfer
                            </span>
                          </div>
                          <p className="text-xs text-spice-brown/70 mt-0.5">
                            Pay with your favourite UPI app via Dynamic QR or 1-tap mobile buttons. Verified with UTR.
                          </p>
                        </div>
                      </label>

                      {/* Expandable UPI Payment Panel */}
                      {formData.paymentMethod === 'upi' && (
                        <div className="px-3 pb-4 sm:px-4">
                          <UpiPaymentPanel
                            amount={finalTotal}
                            config={paymentConfig}
                            utrNumber={utrNumber}
                            setUtrNumber={setUtrNumber}
                            screenshotUrl={screenshotUrl}
                            setScreenshotUrl={setScreenshotUrl}
                          />
                        </div>
                      )}
                    </div>

                    {/* 2. Cash on Delivery */}
                    <label
                      className={`flex items-start p-4 rounded-2xl border cursor-pointer transition-all ${
                        formData.paymentMethod === 'cod'
                          ? 'border-spice-crimson bg-spice-cream/80 shadow-xs'
                          : 'border-spice-tan/60 hover:bg-spice-sand/30 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                        className="mt-1 text-spice-crimson focus:ring-spice-crimson"
                      />
                      <div className="ml-3">
                        <span className="font-serif font-bold text-sm text-spice-brown flex items-center space-x-2">
                          <Banknote className="w-4 h-4 text-spice-green" />
                          <span>Cash on Delivery (COD)</span>
                        </span>
                        <p className="text-xs text-spice-brown/70 mt-0.5">
                          Pay with cash or scan the courier's QR code when your fresh spices arrive at your doorstep.
                        </p>
                      </div>
                    </label>

                    {/* 3. WhatsApp Direct Order & Pay */}
                    <label
                      className={`flex items-start p-4 rounded-2xl border cursor-pointer transition-all ${
                        formData.paymentMethod === 'whatsapp'
                          ? 'border-spice-crimson bg-spice-cream/80 shadow-xs'
                          : 'border-spice-tan/60 hover:bg-spice-sand/30 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="whatsapp"
                        checked={formData.paymentMethod === 'whatsapp'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'whatsapp' })}
                        className="mt-1 text-spice-crimson focus:ring-spice-crimson"
                      />
                      <div className="ml-3">
                        <span className="font-serif font-bold text-sm text-spice-brown flex items-center space-x-2">
                          <MessageCircle className="w-4 h-4 text-[#25D366]" />
                          <span>Order via WhatsApp & Pay</span>
                        </span>
                        <p className="text-xs text-spice-brown/70 mt-0.5">
                          Place order and chat with our Chilika Spices team on WhatsApp (+91 96686 59633) to pay.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-3 border-t border-spice-tan/40 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-spice-brown hover:text-spice-crimson"
                  >
                    ← Back to Address
                  </button>

                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={submitting}
                    className="flex items-center space-x-2 py-3.5 px-8 bg-spice-crimson hover:bg-spice-deepRed text-white rounded-2xl text-xs font-bold shadow-spice transition-all disabled:opacity-70 active:scale-95"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Placing Order...' : `Place Order (₹${finalTotal})`}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Items & Total Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 border border-spice-tan/60 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-spice-brown border-b border-spice-tan/40 pb-2">
                Items in Order ({cartItems.length})
              </h3>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 no-scrollbar">
                {cartItems.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex items-center space-x-3 text-xs">
                    <img
                      src={item.image || '/images/products/turmeric.jpg'}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover bg-spice-sand/30 shrink-0 border border-spice-tan/40"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-spice-brown truncate">{item.name}</p>
                      <p className="text-spice-brown/60 text-[11px]">{item.size} × {item.quantity}</p>
                    </div>
                    <span className="font-bold text-spice-brown">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="border-t border-spice-tan/40 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-spice-brown/80">
                  <span>Subtotal</span>
                  <span className="font-semibold text-spice-brown">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-spice-brown/80">
                  <span>Shipping Fee</span>
                  <span>{shippingFee === 0 ? <strong className="text-spice-green">FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-spice-green font-semibold">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="border-t border-spice-tan/40 pt-2.5 flex justify-between font-serif font-bold text-base text-spice-brown">
                  <span>Total Payable</span>
                  <span className="text-spice-crimson">₹{finalTotal}</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-spice-brown/60 space-y-1">
                <p className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-spice-green shrink-0" />
                  <span>100% Secure SSL encrypted checkout</span>
                </p>
                <p>Packaged with care directly from Odisha spice farms.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
