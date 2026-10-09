import React, { useState, useEffect } from 'react';
import { MapPin, X, Check, ShieldCheck, Sparkles, Navigation, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAddress } from '../../context/AddressContext';
import { api } from '../../services/api';

export const DeliveryAddressModal = () => {
  const { defaultAddress, saveDefaultAddress, isAddressModalOpen, closeAddressModal } = useAddress();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: 'Bhubaneswar',
    state: 'Odisha',
    pincode: ''
  });

  const [pincodeStatus, setPincodeStatus] = useState('');
  const [isServiceable, setIsServiceable] = useState(true);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [saving, setSaving] = useState(false);

  // Validate pincode serviceability against admin panel settings
  const verifyPincode = async (pin) => {
    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setPincodeStatus('');
      setIsServiceable(true);
      setDeliveryInfo(null);
      return;
    }

    setIsCheckingPincode(true);
    try {
      const res = await api.checkPincodeServiceability(pin);
      if (res.success) {
        setIsServiceable(res.isServiceable);
        setPincodeStatus(res.message);
        setDeliveryInfo(res);
      }
    } catch (err) {
      console.warn('Pincode check error:', err);
      // Fallback
      setIsServiceable(true);
      setPincodeStatus('✓ Express courier delivery available');
    } finally {
      setIsCheckingPincode(false);
    }
  };

  useEffect(() => {
    if (defaultAddress) {
      setFormData({
        fullName: defaultAddress.fullName || '',
        phone: defaultAddress.phone || '',
        street: defaultAddress.street || '',
        city: defaultAddress.city || 'Bhubaneswar',
        state: defaultAddress.state || 'Odisha',
        pincode: defaultAddress.pincode || ''
      });
      if (defaultAddress.pincode && defaultAddress.pincode.length === 6) {
        verifyPincode(defaultAddress.pincode);
      }
    }
  }, [defaultAddress, isAddressModalOpen]);

  if (!isAddressModalOpen) return null;

  const handlePincodeChange = (val) => {
    const cleanPin = val.replace(/\D/g, '').slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: cleanPin }));

    if (cleanPin.length === 6) {
      if (cleanPin.startsWith('75') || cleanPin.startsWith('76')) {
        setFormData((prev) => ({ ...prev, state: 'Odisha' }));
      }
      verifyPincode(cleanPin);
    } else {
      setPincodeStatus('');
      setIsServiceable(true);
      setDeliveryInfo(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.street || formData.pincode.length !== 6) {
      alert('Please fill in your name, phone number, street address, and a valid 6-digit pincode.');
      return;
    }

    if (!isServiceable) {
      alert('Delivery is currently not available to this pincode as configured in store delivery settings.');
      return;
    }

    setSaving(true);
    try {
      await saveDefaultAddress(formData);
      closeAddressModal();
    } catch (err) {
      alert('Failed to save address: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-spice-tan/60 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-spice-tan/40">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-spice-crimson/10 text-spice-crimson flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-spice-brown">
                Set Default Delivery Location
              </h3>
              <p className="text-[11px] text-spice-brown/60">
                Saved address will be pre-filled automatically for all your spice orders
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeAddressModal}
            className="p-1.5 text-gray-400 hover:text-spice-crimson transition-colors rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-spice-brown">
          <div>
            <label className="block font-bold text-spice-brown mb-1">Your Full Name *</label>
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
            <label className="block font-bold text-spice-brown mb-1">Phone Number *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              placeholder="10-digit mobile number"
              className="w-full bg-spice-cream border border-spice-tan rounded-xl px-3.5 py-2.5 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
            />
          </div>

          <div>
            <label className="block font-bold text-spice-brown mb-1">Street Address / House No. / Landmark *</label>
            <textarea
              rows={2}
              required
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              placeholder="House/Flat number, road, nearby landmark"
              className="w-full bg-spice-cream border border-spice-tan rounded-xl px-3.5 py-2.5 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block font-bold text-spice-brown mb-1">Pincode *</label>
              <input
                type="text"
                required
                maxLength={6}
                value={formData.pincode}
                onChange={(e) => handlePincodeChange(e.target.value)}
                placeholder="6-digit PIN"
                className="w-full bg-spice-cream border border-spice-tan rounded-xl px-3 py-2 text-xs text-spice-brown font-mono font-bold focus:outline-none focus:border-spice-crimson"
              />
            </div>

            <div>
              <label className="block font-bold text-spice-brown mb-1">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Bhubaneswar"
                className="w-full bg-spice-cream border border-spice-tan rounded-xl px-3 py-2 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
              />
            </div>

            <div>
              <label className="block font-bold text-spice-brown mb-1">State *</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="e.g. Odisha"
                className="w-full bg-spice-cream border border-spice-tan rounded-xl px-3 py-2 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
              />
            </div>
          </div>

          {isCheckingPincode && (
            <div className="flex items-center space-x-2 text-[11px] font-semibold text-spice-brown/70 bg-spice-cream px-3 py-2 rounded-xl border border-spice-tan/60 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-spice-turmeric" />
              <span>Checking delivery availability for PIN {formData.pincode}...</span>
            </div>
          )}

          {!isCheckingPincode && pincodeStatus && (
            isServiceable ? (
              <div className="flex items-start space-x-2 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-2.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">{pincodeStatus}</p>
                  {deliveryInfo?.estimatedDays && (
                    <p className="text-[10px] text-emerald-700/80">
                      Standard Transit: {deliveryInfo.estimatedDays} dispatch from Chilika, Odisha
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-start space-x-2 text-[11px] font-semibold text-red-800 bg-red-50 px-3 py-2.5 rounded-xl border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">{pincodeStatus}</p>
                  <p className="text-[10px] text-red-700/80">
                    Delivery is currently restricted for this postal PIN by store admin.
                  </p>
                </div>
              </div>
            )
          )}

          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={closeAddressModal}
              className="px-4 py-2 border border-spice-tan/60 rounded-xl text-xs font-bold text-spice-brown hover:bg-spice-sand transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || isCheckingPincode || (!isServiceable && formData.pincode.length === 6)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold shadow-spice transition-all flex items-center space-x-1.5 ${
                (!isServiceable && formData.pincode.length === 6)
                  ? 'bg-gray-400 text-white cursor-not-allowed opacity-70'
                  : 'bg-spice-crimson hover:bg-spice-deepRed text-white'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Set as Default Address'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
