import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useContent } from '../context/ContentContext';

export const ContactPage = () => {
  const { content } = useContent();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const phone = content?.contactPhone || "+91 98765 43210";
  const email = content?.contactEmail || "care@chilikaspices.com";
  const address = content?.contactAddress || "Chilika Spice Co., Old Town, Khordha / Puri District, Odisha, India";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await api.sendContactMessage(formData);
      if (res.success) {
        setSubmitted(true);
        setSuccessMsg(res.message || 'Your inquiry has been emailed directly to our customer care team!');
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Unable to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-spice-cream py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-spice-turmeric uppercase tracking-widest block mb-1">
            We Are Here To Help
          </span>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-spice-brown tracking-tight">
            Contact Chilika Spices
          </h1>
          <p className="text-xs sm:text-sm text-spice-brown/70 mt-2">
            Have questions about an order, custom gift hampers, or our spice milling? Reach out to our village care team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Contact Details */}
          <div className="md:col-span-5 bg-spice-charcoal text-spice-sand rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
            <div>
              <h3 className="font-serif font-bold text-xl text-white mb-2">Get in Touch</h3>
              <p className="text-xs sm:text-sm text-spice-sand/70 leading-relaxed">
                We respond promptly to every home cook, chef, and distributor inquiry.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-spice-turmeric shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Chilika Spice Co.</strong>
                  <span className="text-spice-sand/70">
                    {address}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-spice-turmeric shrink-0" />
                <div>
                  <strong className="block text-white">Customer Support Line</strong>
                  <span className="text-spice-sand/70">{phone} (Mon–Sat, 9AM–7PM)</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-spice-turmeric shrink-0" />
                <div>
                  <strong className="block text-white">Direct Care Inbox</strong>
                  <span className="text-spice-sand/70">{email}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-xs text-spice-sand/60">
              <p>Tagline: "From village to your kitchen"</p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-spice-tan/60 shadow-sm">
            <h3 className="font-serif font-bold text-lg text-spice-brown mb-4 pb-2 border-b border-spice-tan/40">
              Send us a Message
            </h3>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center space-x-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {submitted ? (
              <div className="p-6 bg-green-50 rounded-2xl border border-green-200 text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
                <h4 className="font-serif font-bold text-green-800 text-base">Message Sent Successfully!</h4>
                <p className="text-xs text-green-700">
                  {successMsg}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-bold text-spice-crimson hover:underline"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-spice-brown mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Subrat"
                      className="w-full bg-spice-cream border border-spice-tan rounded-xl px-3.5 py-2.5 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-spice-brown mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full bg-spice-cream border border-spice-tan rounded-xl px-3.5 py-2.5 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-spice-brown mb-1">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full bg-spice-cream border border-spice-tan rounded-xl px-3.5 py-2.5 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-spice-brown mb-1">Your Query / Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we assist your kitchen with our spices?"
                    className="w-full bg-spice-cream border border-spice-tan rounded-xl px-3.5 py-2.5 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center space-x-2 bg-spice-crimson hover:bg-spice-deepRed text-white px-7 py-3 rounded-xl text-xs font-bold shadow-spice transition-all active:scale-95 disabled:opacity-70"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? 'Sending to Inbox...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
