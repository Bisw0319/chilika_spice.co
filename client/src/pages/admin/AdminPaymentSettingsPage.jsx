import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Smartphone,
  Save,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Info,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';

export const AdminPaymentSettingsPage = () => {
  const [config, setConfig] = useState({
    upiId: '9124160550@ybl',
    payeeName: 'Chilika Spices',
    phone: '9124160550',
    isUpiEnabled: true,
    isCodEnabled: true,
    qrCustomNote: 'Pure Village Spices Order',
    instructions: 'Scan QR with any UPI app (GPay / PhonePe / Paytm / BHIM) or tap the mobile buttons. After payment, enter the 12-digit UPI Reference / UTR Number below.'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [previewQr, setPreviewQr] = useState('');
  const [copied, setCopied] = useState(false);
  const [sampleAmount, setSampleAmount] = useState(299);

  // Load active payment configuration
  useEffect(() => {
    setLoading(true);
    api.getPaymentConfig()
      .then((res) => {
        if (res.success && res.config) {
          setConfig(res.config);
        }
      })
      .catch((err) => {
        console.error('Error fetching payment config:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Generate live preview QR code
  useEffect(() => {
    const rawUri = `upi://pay?pa=${encodeURIComponent(config.upiId)}&pn=${encodeURIComponent(config.payeeName)}&am=${sampleAmount}&cu=INR&tn=${encodeURIComponent(config.qrCustomNote || 'Chilika Spices')}`;

    QRCode.toDataURL(rawUri, {
      width: 280,
      margin: 1.5,
      color: {
        dark: '#7A1C1C',
        light: '#FFFDF9'
      }
    })
      .then(setPreviewQr)
      .catch(console.error);
  }, [config.upiId, config.payeeName, config.qrCustomNote, sampleAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', text: '' });

    try {
      const res = await api.updatePaymentConfig(config);
      if (res.success) {
        setFeedback({ type: 'success', text: 'UPI Payment settings updated and live across the store!' });
      } else {
        setFeedback({ type: 'error', text: res.message || 'Failed to update settings.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Network error updating settings.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(config.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 uppercase tracking-wide">
                0% Fee • Zero Commission
              </span>
              <span className="text-xs font-bold text-spice-turmeric flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Direct Bank Settlement</span>
              </span>
            </div>
            <h1 className="font-serif font-bold text-2xl text-gray-900 mt-1">
              UPI & Payment Settings
            </h1>
            <p className="text-xs text-gray-500">
              Configure your store UPI ID, Payee display name, and live payment methods without any gateway fees.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-semibold text-gray-500">Status:</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
              ● Active & Receiving
            </span>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 Cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-sm space-y-5">
          <h2 className="font-serif font-bold text-base text-gray-900 border-b border-gray-100 pb-2">
            Store UPI Configuration
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Store UPI ID / VPA <span className="text-spice-crimson">*</span>
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                required
                value={config.upiId}
                onChange={(e) => setConfig({ ...config, upiId: e.target.value })}
                placeholder="e.g. 9124160550@ybl or yourstore@okaxis"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-mono focus:outline-none focus:border-spice-crimson"
              />
              <button
                type="button"
                onClick={handleCopyUpi}
                className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs transition-colors shrink-0"
                title="Copy UPI ID"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Currently set to test account. When your official business bank UPI is ready, simply replace it here!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Payee Display Name <span className="text-spice-crimson">*</span>
              </label>
              <input
                type="text"
                required
                value={config.payeeName}
                onChange={(e) => setConfig({ ...config, payeeName: e.target.value })}
                placeholder="e.g. Chilika Spices"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-spice-crimson"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                UPI Linked Mobile Number
              </label>
              <input
                type="text"
                value={config.phone}
                onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                placeholder="e.g. 9124160550"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-mono focus:outline-none focus:border-spice-crimson"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              QR Payment Note (Transaction Remarks)
            </label>
            <input
              type="text"
              value={config.qrCustomNote}
              onChange={(e) => setConfig({ ...config, qrCustomNote: e.target.value })}
              placeholder="e.g. Chilika Spices Fresh Order"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-spice-crimson"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Payment Instructions for Customers
            </label>
            <textarea
              rows={3}
              value={config.instructions}
              onChange={(e) => setConfig({ ...config, instructions: e.target.value })}
              placeholder="Instructions displayed on checkout screen"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-spice-crimson"
            />
          </div>

          {/* Payment Method Toggles */}
          <div className="pt-3 border-t border-gray-100 space-y-3">
            <h3 className="font-bold text-xs text-gray-800 uppercase tracking-wider">
              Enable / Disable Payment Methods:
            </h3>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.isUpiEnabled}
                onChange={(e) => setConfig({ ...config, isUpiEnabled: e.target.checked })}
                className="w-4 h-4 text-spice-crimson rounded focus:ring-spice-crimson"
              />
              <span className="text-xs font-bold text-gray-800">
                Enable Instant UPI Payment (0% Gateway Fee)
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.isCodEnabled}
                onChange={(e) => setConfig({ ...config, isCodEnabled: e.target.checked })}
                className="w-4 h-4 text-spice-crimson rounded focus:ring-spice-crimson"
              />
              <span className="text-xs font-bold text-gray-800">
                Enable Cash on Delivery (COD)
              </span>
            </label>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 py-3 px-8 bg-spice-crimson hover:bg-spice-deepRed text-white rounded-2xl text-xs font-bold shadow-spice transition-all disabled:opacity-70 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save & Publish Payment Settings'}</span>
            </button>
          </div>
        </form>

        {/* Right Column: Live QR Preview & Testing (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm text-center space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-serif font-bold text-sm text-gray-900">
                Live Store QR Code Preview
              </h3>
              <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                Dynamic
              </span>
            </div>

            <p className="text-xs text-gray-500">
              Test scan this QR code right now with GPay, PhonePe, or Paytm to verify your UPI setup!
            </p>

            <div className="inline-block p-3.5 bg-[#FFFDF9] rounded-2xl border-2 border-spice-tan shadow-sm mx-auto">
              {previewQr ? (
                <img
                  src={previewQr}
                  alt="Preview UPI QR"
                  className="w-52 h-52 object-contain rounded-lg mx-auto"
                />
              ) : (
                <div className="w-52 h-52 bg-gray-100 rounded-lg flex items-center justify-center animate-pulse">
                  <QrCode className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="mt-2 text-center">
                <span className="text-[11px] font-bold text-spice-crimson block font-mono">
                  {config.upiId}
                </span>
                <span className="text-[10px] text-gray-500">{config.payeeName}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-left space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Test Amount:</span>
                <div className="flex items-center space-x-1">
                  <span className="font-bold text-gray-800">₹</span>
                  <input
                    type="number"
                    value={sampleAmount}
                    onChange={(e) => setSampleAmount(Number(e.target.value) || 1)}
                    className="w-16 bg-white border border-gray-200 rounded px-1.5 py-0.5 text-xs font-bold text-right"
                  />
                </div>
              </div>
              <p className="text-[10px] text-gray-400 pt-1">
                * When customers checkout, the QR code automatically adapts to their exact cart total.
              </p>
            </div>
          </div>

          {/* Zero Fee Advantages Card */}
          <div className="bg-gradient-to-br from-spice-cream to-amber-50 rounded-3xl p-5 border border-spice-tan/60 space-y-2.5 text-xs text-spice-brown">
            <div className="flex items-center space-x-1.5 font-serif font-bold text-spice-brown">
              <ShieldCheck className="w-4 h-4 text-spice-green" />
              <span>Why This Integration is 100% Free:</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-spice-brown/80 list-disc list-inside">
              <li><strong>Zero Gateway Deductions:</strong> No 2% + 18% GST cuts on your spice margins.</li>
              <li><strong>Direct Bank Credit:</strong> Payments land directly into your bank within seconds.</li>
              <li><strong>Effortless Upgrade:</strong> Whenever you receive your official merchant QR, simply update the UPI ID field above!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
