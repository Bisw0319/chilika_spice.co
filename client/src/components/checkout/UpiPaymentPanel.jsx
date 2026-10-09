import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Smartphone,
  Copy,
  Check,
  HelpCircle,
  UploadCloud,
  ShieldCheck,
  Sparkles,
  Info,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { api } from '../../services/api';

export const UpiPaymentPanel = ({
  amount = 0,
  config = {
    upiId: '9124160550@ybl',
    payeeName: 'Chilika Spices',
    phone: '9124160550',
    qrCustomNote: 'Pure Village Spices'
  },
  utrNumber = '',
  setUtrNumber,
  screenshotUrl = '',
  setScreenshotUrl
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showHelpGuide, setShowHelpGuide] = useState(false);

  const upiId = config?.upiId || '9124160550@ybl';
  const payeeName = config?.payeeName || 'Chilika Spices';
  const note = config?.qrCustomNote || 'Chilika Spices Fresh Order';

  // Construct NPCI standard UPI URI
  const rawUpiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(rawUpiUri, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#7A1C1C', // Chilika spice crimson
        light: '#FFFDF9'  // Warm cream background
      },
      errorCorrectionLevel: 'M'
    })
      .then((url) => {
        if (isMounted) setQrCodeUrl(url);
      })
      .catch((err) => {
        console.error('QR Generation failed:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [rawUpiUri, upiId, payeeName, amount, note]);

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleScreenshotUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');
    try {
      const res = await api.uploadImages([file]);
      if (res.success && res.imageUrls?.length > 0) {
        setScreenshotUrl(res.imageUrls[0]);
      } else {
        setUploadError('Failed to upload image. Please try again.');
      }
    } catch (err) {
      setUploadError(err.message || 'Error uploading screenshot.');
    } finally {
      setUploading(false);
    }
  };

  const isUtrValid = /^\d{12}$/.test(utrNumber.trim());

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-spice-tan/70 shadow-sm space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-spice-tan/40">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 tracking-wide uppercase">
              0% Fee • Instant UPI
            </span>
            <span className="text-[11px] font-bold text-spice-turmeric flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Recommended</span>
            </span>
          </div>
          <h3 className="font-serif font-bold text-lg text-spice-brown mt-1">
            Direct UPI Payment (GPay, PhonePe, Paytm, BHIM)
          </h3>
          <p className="text-xs text-spice-brown/70">
            Pay directly to Chilika Spices via your UPI app. No extra gateway charges.
          </p>
        </div>

        <div className="text-left sm:text-right bg-spice-cream px-4 py-2.5 rounded-2xl border border-spice-tan/40">
          <span className="text-[10px] text-spice-brown/60 uppercase tracking-wider block font-semibold">Payable Amount</span>
          <span className="font-serif font-bold text-xl text-spice-crimson">₹{amount}</span>
        </div>
      </div>

      {/* Two Column Layout for Desktop (QR Code Left, Step & Intent Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Dynamic QR Code */}
        <div className="md:col-span-5 flex flex-col items-center text-center p-4 bg-spice-cream/60 rounded-2xl border border-spice-tan/50">
          <div className="relative p-3 bg-[#FFFDF9] rounded-2xl border-2 border-spice-tan/80 shadow-md">
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="Chilika Spices UPI QR Code"
                className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-lg"
              />
            ) : (
              <div className="w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center bg-spice-sand/30 rounded-lg">
                <QrCode className="w-12 h-12 text-spice-brown/40 animate-pulse" />
              </div>
            )}
            <div className="mt-2 flex items-center justify-center space-x-1.5 text-[11px] font-bold text-spice-crimson">
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan with any UPI App</span>
            </div>
          </div>

          {/* Payee Details */}
          <div className="mt-3 w-full bg-white px-3.5 py-2.5 rounded-xl border border-spice-tan/40 text-left space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-spice-brown/60 text-[11px]">Store UPI ID:</span>
              <button
                type="button"
                onClick={handleCopyUpiId}
                className="font-mono font-bold text-spice-crimson hover:text-spice-deepRed flex items-center space-x-1 text-xs"
                title="Click to copy UPI ID"
              >
                <span>{upiId}</span>
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            {copied && (
              <p className="text-[10px] text-green-600 font-semibold text-right">
                ✓ UPI ID copied to clipboard!
              </p>
            )}
            <div className="flex items-center justify-between text-[11px] text-spice-brown/70 pt-0.5">
              <span>Payee Name:</span>
              <span className="font-semibold text-spice-brown">{payeeName}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Mobile 1-Tap Buttons & Payment Verification Form */}
        <div className="md:col-span-7 space-y-5">
          {/* Mobile Instant Pay Buttons (visible and prominent) */}
          <div>
            <div className="flex items-center space-x-1.5 mb-2.5">
              <Smartphone className="w-4 h-4 text-spice-crimson" />
              <label className="text-xs font-bold uppercase tracking-wider text-spice-brown">
                Tap to Pay with Mobile UPI App:
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Google Pay */}
              <a
                href={`tez://upi/pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`}
                className="flex flex-col items-center justify-center p-2.5 bg-white hover:bg-spice-cream rounded-xl border border-spice-tan/60 hover:border-spice-crimson shadow-xs transition-all active:scale-95 group"
              >
                <div className="w-7 h-7 rounded-full bg-green-50 text-green-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                  G
                </div>
                <span className="text-[11px] font-bold text-spice-brown mt-1">Google Pay</span>
              </a>

              {/* PhonePe */}
              <a
                href={`phonepe://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`}
                className="flex flex-col items-center justify-center p-2.5 bg-white hover:bg-spice-cream rounded-xl border border-spice-tan/60 hover:border-spice-crimson shadow-xs transition-all active:scale-95 group"
              >
                <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                  Pe
                </div>
                <span className="text-[11px] font-bold text-spice-brown mt-1">PhonePe</span>
              </a>

              {/* Paytm */}
              <a
                href={`paytmmp://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`}
                className="flex flex-col items-center justify-center p-2.5 bg-white hover:bg-spice-cream rounded-xl border border-spice-tan/60 hover:border-spice-crimson shadow-xs transition-all active:scale-95 group"
              >
                <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                  Pay
                </div>
                <span className="text-[11px] font-bold text-spice-brown mt-1">Paytm</span>
              </a>

              {/* Generic UPI Standard intent */}
              <a
                href={rawUpiUri}
                className="flex flex-col items-center justify-center p-2.5 bg-spice-crimson hover:bg-spice-deepRed text-white rounded-xl shadow-xs transition-all active:scale-95 group"
              >
                <ExternalLink className="w-5 h-5 mb-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold">Any UPI App</span>
              </a>
            </div>
            <p className="text-[10px] text-spice-brown/60 mt-1.5">
              * On mobile devices, clicking an app directly opens it with ₹{amount} prefilled.
            </p>
          </div>

          {/* Simple Step-by-Step Instructions */}
          <div className="bg-spice-cream/80 p-3.5 rounded-2xl border border-spice-tan/40 text-xs text-spice-brown space-y-1.5">
            <span className="font-bold text-spice-crimson block text-[11px] uppercase tracking-wider">
              How to Complete Your Order in 3 Simple Steps:
            </span>
            <div className="space-y-1 text-[11px] text-spice-brown/80">
              <p><strong>1.</strong> Scan the QR code or tap one of the UPI buttons above.</p>
              <p><strong>2.</strong> Complete the payment of <strong>₹{amount}</strong> in your UPI app.</p>
              <p><strong>3.</strong> Enter the <strong>12-digit UPI UTR / Reference Number</strong> from your payment receipt below.</p>
            </div>
          </div>

          {/* Mandatory 12-Digit UTR Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-spice-brown">
                Enter 12-Digit UPI Reference / UTR Number <span className="text-spice-crimson">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowHelpGuide(!showHelpGuide)}
                className="text-[11px] font-bold text-spice-crimson hover:underline flex items-center space-x-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Where to find UTR?</span>
                {showHelpGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                required
                maxLength={12}
                value={utrNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, ''); // only numeric digits
                  setUtrNumber(val);
                }}
                placeholder="e.g. 428192837482 (12 digits)"
                className={`w-full bg-spice-cream border rounded-xl px-3.5 py-3 text-xs sm:text-sm font-mono tracking-widest text-spice-brown focus:outline-none transition-colors ${
                  isUtrValid
                    ? 'border-green-500 bg-green-50/30 focus:border-green-600'
                    : utrNumber.length > 0
                    ? 'border-amber-400 focus:border-amber-500'
                    : 'border-spice-tan focus:border-spice-crimson'
                }`}
              />
              <div className="absolute right-3 top-3 text-xs">
                {isUtrValid ? (
                  <span className="text-green-600 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Valid UTR</span>
                  </span>
                ) : (
                  <span className="text-gray-400 font-mono text-[11px]">
                    {utrNumber.length}/12 digits
                  </span>
                )}
              </div>
            </div>

            {/* Help Guide Accordion */}
            {showHelpGuide && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1.5 animate-fadeIn">
                <p className="font-bold flex items-center space-x-1">
                  <Info className="w-3.5 h-3.5 text-amber-700" />
                  <span>Where is your 12-digit UTR located in UPI apps?</span>
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-amber-800">
                  <li><strong>Google Pay:</strong> Tap transaction details → look for <em>"UPI Transaction ID"</em> (12 digits).</li>
                  <li><strong>PhonePe:</strong> View transaction history → tap payment → look for <em>"UTR"</em> (12 digits).</li>
                  <li><strong>Paytm:</strong> Tap order in passbook → look for <em>"UPI Ref No."</em> (12 digits).</li>
                </ul>
              </div>
            )}
          </div>

          {/* Optional Screenshot Upload */}
          <div className="space-y-1.5 pt-1 border-t border-spice-tan/30">
            <label className="block text-xs font-semibold text-spice-brown/80">
              Payment Screenshot <span className="text-gray-400 font-normal">(Optional for faster approval)</span>:
            </label>
            <div className="flex items-center space-x-3">
              <label className="cursor-pointer inline-flex items-center space-x-2 px-3.5 py-2 bg-spice-cream hover:bg-spice-sand border border-spice-tan/60 rounded-xl text-xs font-semibold text-spice-brown transition-colors">
                <UploadCloud className="w-4 h-4 text-spice-crimson" />
                <span>{uploading ? 'Uploading...' : screenshotUrl ? 'Change Screenshot' : 'Upload Receipt'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>

              {screenshotUrl && (
                <div className="flex items-center space-x-2 text-[11px] text-green-700 font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Screenshot attached ✓</span>
                  <a
                    href={screenshotUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-spice-crimson underline ml-1"
                  >
                    View
                  </a>
                </div>
              )}
            </div>
            {uploadError && <p className="text-[10px] text-red-600">{uploadError}</p>}
          </div>

          {/* Odia Brand Trust Badge */}
          <div className="pt-2 flex items-center space-x-2 text-[11px] text-spice-brown/60">
            <ShieldCheck className="w-4 h-4 text-spice-green shrink-0" />
            <span>100% Secure Direct Bank Transfer. Zero Gateway Fees. Verified by Chilika Spices Team.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
