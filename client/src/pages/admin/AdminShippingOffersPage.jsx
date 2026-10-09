import React, { useState, useEffect } from 'react';
import {
  Truck,
  TicketPercent,
  Package,
  Mail,
  Save,
  CheckCircle2,
  Info,
  Sparkles,
  ShieldCheck,
  Building2,
  MapPin,
  FileText,
  Send,
  AlertCircle,
  Search
} from 'lucide-react';
import { api } from '../../services/api';

export const AdminShippingOffersPage = () => {
  const [activeTab, setActiveTab] = useState('shipping'); // 'shipping' | 'offers' | 'logistics' | 'emails'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Pincode test simulator in admin
  const [testPin, setTestPin] = useState('');
  const [testPinResult, setTestPinResult] = useState(null);

  // Email test sender
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [sendingTestMail, setSendingTestMail] = useState(false);
  const [testMailFeedback, setTestMailFeedback] = useState({ type: '', text: '' });

  const [settings, setSettings] = useState({
    // Delivery fees
    standardShippingFee: 49,
    freeShippingThreshold: 499,
    expressShippingFee: 99,
    codExtraFee: 0,
    estimatedDeliveryDays: '3–5 Business Days',
    shippingNotice: 'Free standard shipping on orders above ₹499 across India',

    // Offers & announcements
    announcementActive: true,
    announcementText: 'Authentic spices inspired by the kitchens of Odisha • Free shipping on orders above ₹499',
    topBannerOfferCode: 'CHILIKA10',
    topBannerOfferText: 'Flat 10% OFF on your spice order with coupon code CHILIKA10',
    isOfferActive: true,

    // Logistics & Courier Label
    courierPartner: 'Express Logistics',
    shipperName: 'Chilika Spices Pvt. Ltd.',
    shipperPhone: '+91 96686 59633',
    shipperAddress: 'Plot 108, Chilika Coastal Road, Balugaon, Dist: Khordha',
    shipperCity: 'Chilika',
    shipperState: 'Odisha',
    shipperPincode: '752030',
    gstNumber: '21AABCC1234D1Z8',
    fssaiNumber: '12026001000888',
    hubCode: 'HUB-OD-BBI01',

    // Pincode Serviceability
    pincodeControlMode: 'all_india', // 'all_india' | 'restricted'
    serviceablePincodes: ['751001', '751002', '751003', '751024', '752030', '752054', '753001', '756001', '760001'],
    serviceablePrefixes: ['75', '76'],
    serviceableMessage: '✓ Express delivery available (3–5 business days)',
    nonServiceableMessage: '✕ Delivery is currently not available to this pincode',

    // Email Notification Controls
    adminNotificationEmail: 'freelixir.b@gmail.com',
    orderAlertEmails: 'freelixir.b@gmail.com, biswajitbaral193@gmail.com',
    supportEmail: 'care@chilikaspices.com',
    sendCustomerReceipt: true,
    sendAdminOrderAlert: true
  });

  // State for raw textarea input of pincodes and prefixes
  const [pincodeText, setPincodeText] = useState('');
  const [prefixText, setPrefixText] = useState('');

  useEffect(() => {
    setLoading(true);
    api.getStoreSettings()
      .then((res) => {
        if (res.success && res.settings) {
          setSettings(res.settings);
          if (res.settings.serviceablePincodes) {
            setPincodeText(
              Array.isArray(res.settings.serviceablePincodes)
                ? res.settings.serviceablePincodes.join(', ')
                : res.settings.serviceablePincodes
            );
          }
          if (res.settings.serviceablePrefixes) {
            setPrefixText(
              Array.isArray(res.settings.serviceablePrefixes)
                ? res.settings.serviceablePrefixes.join(', ')
                : res.settings.serviceablePrefixes
            );
          }
          if (res.settings.adminNotificationEmail) {
            setTestEmailAddress(res.settings.adminNotificationEmail);
          }
        }
      })
      .catch((err) => {
        console.error('Error loading store settings:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleTestPincode = () => {
    const clean = testPin.replace(/\D/g, '').slice(0, 6);
    if (clean.length !== 6) {
      setTestPinResult({ valid: false, message: 'Please enter a valid 6-digit PIN code to test.' });
      return;
    }

    if (settings.pincodeControlMode === 'all_india') {
      setTestPinResult({
        valid: true,
        available: true,
        message: `${settings.serviceableMessage || '✓ Express delivery available'} (Pan-India delivery is active)`
      });
      return;
    }

    // Restricted mode check
    const list = pincodeText.split(/[,\n\r\s]+/).map(s => s.trim()).filter(Boolean);
    const prefixes = prefixText.split(/[,\n\r\s]+/).map(s => s.trim()).filter(Boolean);

    const isMatch = list.includes(clean) || prefixes.some(p => clean.startsWith(p));
    setTestPinResult({
      valid: true,
      available: isMatch,
      message: isMatch
        ? (settings.serviceableMessage || '✓ Delivery Available')
        : (settings.nonServiceableMessage || '✕ Delivery Not Available')
    });
  };

  const handleSendTestEmail = async () => {
    const target = testEmailAddress.trim() || settings.adminNotificationEmail;
    if (!target || !target.includes('@')) {
      setTestMailFeedback({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    setSendingTestMail(true);
    setTestMailFeedback({ type: '', text: '' });
    try {
      const res = await api.sendTestEmail(target);
      if (res.success) {
        setTestMailFeedback({
          type: 'success',
          text: `✓ Test verification email successfully dispatched to ${target}!`
        });
      } else {
        setTestMailFeedback({ type: 'error', text: res.message || 'Failed to send test email.' });
      }
    } catch (err) {
      setTestMailFeedback({ type: 'error', text: err.message || 'Error sending test email.' });
    } finally {
      setSendingTestMail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', text: '' });

    const payload = {
      ...settings,
      serviceablePincodes: pincodeText,
      serviceablePrefixes: prefixText
    };

    try {
      const res = await api.updateStoreSettings(payload);
      if (res.success) {
        setFeedback({
          type: 'success',
          text: 'Store delivery fees, pincode serviceability, offers, and email settings updated successfully!'
        });
        if (res.settings) {
          setSettings(res.settings);
        }
      } else {
        setFeedback({ type: 'error', text: res.message || 'Failed to update settings.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Error saving settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-3 border-spice-crimson border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-spice-sand text-spice-brown uppercase tracking-wide">
                Admin Settings
              </span>
              <span className="text-xs font-bold text-spice-crimson flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Real-Time Storefront Configuration</span>
              </span>
            </div>
            <h1 className="font-serif font-bold text-2xl text-gray-900 mt-1">
              Delivery Charges, Pincode Zones & Notifications
            </h1>
            <p className="text-xs text-gray-500">
              Manage shipping fees, free shipping rules, pincode availability, and admin notification emails.
            </p>
          </div>
        </div>
      </div>

      {feedback.text && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center space-x-2 ${
            feedback.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('shipping')}
          className={`pb-3 px-4 font-bold text-xs flex items-center space-x-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'shipping'
              ? 'border-spice-crimson text-spice-crimson'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Delivery Charges & Pincodes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('offers')}
          className={`pb-3 px-4 font-bold text-xs flex items-center space-x-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'offers'
              ? 'border-spice-crimson text-spice-crimson'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <TicketPercent className="w-4 h-4" />
          <span>Offers & Announcements</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logistics')}
          className={`pb-3 px-4 font-bold text-xs flex items-center space-x-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'logistics'
              ? 'border-spice-crimson text-spice-crimson'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Courier Shipping Label Format</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('emails')}
          className={`pb-3 px-4 font-bold text-xs flex items-center space-x-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'emails'
              ? 'border-spice-crimson text-spice-crimson'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Admin Notification Emails</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TAB 1: SHIPPING CHARGES & PINCODES */}
        {activeTab === 'shipping' && (
          <div className="space-y-6">
            {/* Delivery Fees Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-sm space-y-5">
              <h2 className="font-serif font-bold text-base text-gray-900 border-b border-gray-100 pb-2">
                Shipping Charges & Free Delivery Threshold
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Standard Delivery Fee (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={settings.standardShippingFee}
                    onChange={(e) => setSettings({ ...settings, standardShippingFee: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-spice-crimson font-bold"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Charged when order total is below free delivery threshold.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Free Delivery Order Threshold (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={settings.freeShippingThreshold}
                    onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-spice-crimson font-bold"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Orders with cart total equal to or above this amount get 100% Free Shipping.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Express Shipping Surcharge (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={settings.expressShippingFee}
                    onChange={(e) => setSettings({ ...settings, expressShippingFee: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-spice-crimson"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    COD Extra Handling Fee (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={settings.codExtraFee}
                    onChange={(e) => setSettings({ ...settings, codExtraFee: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-spice-crimson"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Set to 0 for free COD.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Estimated Delivery Timeline *
                </label>
                <input
                  type="text"
                  required
                  value={settings.estimatedDeliveryDays}
                  onChange={(e) => setSettings({ ...settings, estimatedDeliveryDays: e.target.value })}
                  placeholder="e.g. 3–5 Business Days"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-spice-crimson"
                />
              </div>
            </div>

            {/* Pincode Serviceability Control Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div>
                  <h2 className="font-serif font-bold text-base text-gray-900">
                    Pincode Serviceability & Delivery Zones
                  </h2>
                  <p className="text-[11px] text-gray-500">
                    Control which PIN codes show as "Available" or "Unavailable" to customers on the website.
                  </p>
                </div>
                <MapPin className="w-5 h-5 text-spice-crimson" />
              </div>

              {/* Serviceability Mode Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Delivery Coverage Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-start space-x-3 transition-all ${
                      settings.pincodeControlMode === 'all_india'
                        ? 'border-spice-crimson bg-spice-cream/50 ring-1 ring-spice-crimson'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pincodeControlMode"
                      value="all_india"
                      checked={settings.pincodeControlMode === 'all_india'}
                      onChange={() => setSettings({ ...settings, pincodeControlMode: 'all_india' })}
                      className="mt-0.5 text-spice-crimson focus:ring-spice-crimson"
                    />
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">Pan-India Active (All Pincodes)</span>
                      <span className="text-[10px] text-gray-500 block mt-0.5 leading-relaxed">
                        All valid 6-digit Indian PIN codes will show as "Available for Express Delivery".
                      </span>
                    </div>
                  </label>

                  <label
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-start space-x-3 transition-all ${
                      settings.pincodeControlMode === 'restricted'
                        ? 'border-spice-crimson bg-spice-cream/50 ring-1 ring-spice-crimson'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pincodeControlMode"
                      value="restricted"
                      checked={settings.pincodeControlMode === 'restricted'}
                      onChange={() => setSettings({ ...settings, pincodeControlMode: 'restricted' })}
                      className="mt-0.5 text-spice-crimson focus:ring-spice-crimson"
                    />
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">Restricted Zones Only</span>
                      <span className="text-[10px] text-gray-500 block mt-0.5 leading-relaxed">
                        Only deliver to pincodes matching the list or prefixes below. Others show "Not Available".
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Serviceable Pincodes Inputs */}
              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    State / Region PIN Code Prefixes (Auto-Serviceable)
                  </label>
                  <input
                    type="text"
                    value={prefixText}
                    onChange={(e) => setPrefixText(e.target.value)}
                    placeholder="e.g. 75, 76 (75 and 76 cover entire state of Odisha)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-mono focus:outline-none focus:border-spice-crimson"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Any pincode starting with these digits will be marked available (comma-separated).
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Specific Serviceable 6-Digit PIN Codes List
                  </label>
                  <textarea
                    rows={3}
                    value={pincodeText}
                    onChange={(e) => setPincodeText(e.target.value)}
                    placeholder="e.g. 751001, 751002, 752030, 753001, 110001, 700001"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-mono focus:outline-none focus:border-spice-crimson"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Enter individual serviceable PIN codes separated by comma, space or new line.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Customer Message when Available
                    </label>
                    <input
                      type="text"
                      value={settings.serviceableMessage}
                      onChange={(e) => setSettings({ ...settings, serviceableMessage: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-spice-crimson"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Customer Message when NOT Available
                    </label>
                    <input
                      type="text"
                      value={settings.nonServiceableMessage}
                      onChange={(e) => setSettings({ ...settings, nonServiceableMessage: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-spice-crimson"
                    />
                  </div>
                </div>
              </div>

              {/* Live Simulator Test Box */}
              <div className="bg-spice-cream/60 p-4 rounded-2xl border border-spice-tan/50 space-y-3">
                <span className="text-xs font-bold text-spice-brown uppercase tracking-wider block">
                  🔍 Live Pincode Serviceability Test Simulator
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={testPin}
                    onChange={(e) => setTestPin(e.target.value)}
                    placeholder="Enter 6-digit PIN code to test (e.g. 751001 or 560001)"
                    className="flex-1 bg-white border border-spice-tan rounded-xl px-3.5 py-2 text-xs font-mono text-gray-900 focus:outline-none focus:border-spice-crimson"
                  />
                  <button
                    type="button"
                    onClick={handleTestPincode}
                    className="px-4 py-2 bg-spice-crimson hover:bg-spice-deepRed text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Test PIN
                  </button>
                </div>

                {testPinResult && (
                  <div
                    className={`p-2.5 rounded-xl text-xs font-bold ${
                      testPinResult.available
                        ? 'bg-green-100 text-green-900 border border-green-300'
                        : 'bg-red-100 text-red-900 border border-red-300'
                    }`}
                  >
                    {testPinResult.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OFFERS & PROMO BANNERS */}
        {activeTab === 'offers' && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-sm space-y-5">
            <h2 className="font-serif font-bold text-base text-gray-900 border-b border-gray-100 pb-2">
              Promotional Announcement Bar & Banner Offers
            </h2>

            {/* Announcement Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-gray-800 block">Top Header Announcement Bar</span>
                  <span className="text-[11px] text-gray-400">
                    Displays at the very top of every storefront page.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.announcementActive}
                    onChange={(e) => setSettings({ ...settings, announcementActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-spice-crimson"></div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Announcement Text Message
                </label>
                <textarea
                  rows={2}
                  value={settings.announcementText}
                  onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                  placeholder="e.g. Authentic spices from Odisha • Free shipping on orders above ₹499"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-spice-crimson"
                />
              </div>
            </div>

            {/* Promo Code Banner */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-gray-800 block">Promotional Coupon Banner</span>
                  <span className="text-[11px] text-gray-400">
                    Highlight a featured discount code for first-time or returning customers.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.isOfferActive}
                    onChange={(e) => setSettings({ ...settings, isOfferActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-spice-crimson"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Featured Coupon Code
                  </label>
                  <input
                    type="text"
                    value={settings.topBannerOfferCode}
                    onChange={(e) => setSettings({ ...settings, topBannerOfferCode: e.target.value.toUpperCase() })}
                    placeholder="e.g. CHILIKA10"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-mono font-bold focus:outline-none focus:border-spice-crimson"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Offer Description Text
                  </label>
                  <input
                    type="text"
                    value={settings.topBannerOfferText}
                    onChange={(e) => setSettings({ ...settings, topBannerOfferText: e.target.value })}
                    placeholder="e.g. Flat 10% OFF on all orders"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-spice-crimson"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COURIER & LOGISTICS LABEL FORMAT */}
        {activeTab === 'logistics' && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-sm space-y-5">
            <h2 className="font-serif font-bold text-base text-gray-900 border-b border-gray-100 pb-2">
              Courier Delivery Copy & Logistics Manifest (Copied Standard Format)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Courier Partner Name *
                </label>
                <input
                  type="text"
                  required
                  value={settings.courierPartner}
                  onChange={(e) => setSettings({ ...settings, courierPartner: e.target.value })}
                  placeholder="e.g. Express Logistics"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-bold focus:outline-none focus:border-spice-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Sorting Hub Code *
                </label>
                <input
                  type="text"
                  required
                  value={settings.hubCode}
                  onChange={(e) => setSettings({ ...settings, hubCode: e.target.value })}
                  placeholder="e.g. HUB-OD-BBI01"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-mono font-bold focus:outline-none focus:border-spice-crimson"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Shipper / Consignor Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={settings.shipperName}
                  onChange={(e) => setSettings({ ...settings, shipperName: e.target.value })}
                  placeholder="e.g. Chilika Spices Pvt. Ltd."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-spice-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Warehouse Dispatch Phone *
                </label>
                <input
                  type="text"
                  required
                  value={settings.shipperPhone}
                  onChange={(e) => setSettings({ ...settings, shipperPhone: e.target.value })}
                  placeholder="e.g. +91 96686 59633"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-mono focus:outline-none focus:border-spice-crimson"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Dispatch / Return Warehouse Street Address *
              </label>
              <textarea
                rows={2}
                required
                value={settings.shipperAddress}
                onChange={(e) => setSettings({ ...settings, shipperAddress: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-spice-crimson"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">City / Town *</label>
                <input
                  type="text"
                  required
                  value={settings.shipperCity}
                  onChange={(e) => setSettings({ ...settings, shipperCity: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-spice-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={settings.shipperState}
                  onChange={(e) => setSettings({ ...settings, shipperState: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-spice-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Warehouse PIN *</label>
                <input
                  type="text"
                  required
                  value={settings.shipperPincode}
                  onChange={(e) => setSettings({ ...settings, shipperPincode: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 font-mono font-bold focus:outline-none focus:border-spice-crimson"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">GSTIN Number</label>
                <input
                  type="text"
                  value={settings.gstNumber}
                  onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value.toUpperCase() })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-mono focus:outline-none focus:border-spice-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">FSSAI License Number</label>
                <input
                  type="text"
                  value={settings.fssaiNumber}
                  onChange={(e) => setSettings({ ...settings, fssaiNumber: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-mono focus:outline-none focus:border-spice-crimson"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ADMIN NOTIFICATION EMAILS (Point 5) */}
        {activeTab === 'emails' && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div>
                <h2 className="font-serif font-bold text-base text-gray-900">
                  Store Notification & Email Routing Controls
                </h2>
                <p className="text-[11px] text-gray-500">
                  Control which administrator email receives new order alerts, customer messages, and invoices.
                </p>
              </div>
              <Mail className="w-5 h-5 text-spice-crimson" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Primary Admin Notification Email *
                </label>
                <input
                  type="email"
                  required
                  value={settings.adminNotificationEmail}
                  onChange={(e) => setSettings({ ...settings, adminNotificationEmail: e.target.value })}
                  placeholder="e.g. freelixir.b@gmail.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:border-spice-crimson"
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">
                  All new order alerts, customer inquiries, and system notifications go directly here.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Additional Alert Receivers (Comma-separated)
                </label>
                <input
                  type="text"
                  value={settings.orderAlertEmails}
                  onChange={(e) => setSettings({ ...settings, orderAlertEmails: e.target.value })}
                  placeholder="e.g. freelixir.b@gmail.com, biswajitbaral193@gmail.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-spice-crimson"
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">
                  Add team or partner email addresses to receive instant order notifications.
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Customer Support / Reply-to Email
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                placeholder="e.g. care@chilikaspices.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-spice-crimson"
              />
            </div>

            {/* Notification Toggles */}
            <div className="pt-3 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-xs font-bold text-gray-800 block">Send Admin Order Alert on Every Purchase</span>
                  <span className="text-[10px] text-gray-500">
                    Dispatches full customer name, phone, address, items and UPI UTR to your admin email.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.sendAdminOrderAlert}
                    onChange={(e) => setSettings({ ...settings, sendAdminOrderAlert: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-spice-crimson"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-xs font-bold text-gray-800 block">Send Customer Tax Invoice Receipt</span>
                  <span className="text-[10px] text-gray-500">
                    Sends branded email receipt with order details directly to customer upon checkout.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.sendCustomerReceipt}
                    onChange={(e) => setSettings({ ...settings, sendCustomerReceipt: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-spice-crimson"></div>
                </label>
              </div>
            </div>

            {/* Test Email Dispatch Box */}
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
              <span className="text-xs font-bold text-amber-900 block flex items-center space-x-1.5">
                <Send className="w-3.5 h-3.5 text-amber-700" />
                <span>Test Notification Email Delivery</span>
              </span>
              <p className="text-[11px] text-amber-800">
                Send a live test verification email right now to confirm messages arrive in your inbox.
              </p>

              <div className="flex gap-2">
                <input
                  type="email"
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  placeholder="Target test email (e.g. freelixir.b@gmail.com)"
                  className="flex-1 bg-white border border-amber-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-spice-crimson"
                />
                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  disabled={sendingTestMail}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-60 flex items-center space-x-1.5"
                >
                  <Send className="w-3 h-3" />
                  <span>{sendingTestMail ? 'Sending...' : 'Send Test Mail'}</span>
                </button>
              </div>

              {testMailFeedback.text && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-bold ${
                    testMailFeedback.type === 'success'
                      ? 'bg-green-100 text-green-900 border border-green-300'
                      : 'bg-red-100 text-red-900 border border-red-300'
                  }`}
                >
                  {testMailFeedback.text}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Global Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 py-3 px-8 bg-spice-crimson hover:bg-spice-deepRed text-white rounded-2xl text-xs font-bold shadow-spice transition-all disabled:opacity-70 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save & Update Store Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
