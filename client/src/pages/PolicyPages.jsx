import React from 'react';
import { ShieldCheck, Truck, RotateCcw, FileText } from 'lucide-react';

export const PrivacyPolicyPage = () => (
  <div className="min-h-screen bg-spice-cream py-10 sm:py-16">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl p-6 sm:p-10 border border-spice-tan/60 shadow-sm space-y-6 text-xs sm:text-sm text-spice-brown/80 leading-relaxed">
      <div className="flex items-center space-x-3 pb-4 border-b border-spice-tan/40">
        <ShieldCheck className="w-8 h-8 text-spice-crimson" />
        <div>
          <h1 className="font-serif font-bold text-2xl text-spice-brown">Privacy Policy</h1>
          <p className="text-xs text-spice-brown/60">Last updated: January 2026</p>
        </div>
      </div>
      <p>
        At Chilika Spices ("we", "our", or "us"), we value and respect your privacy. This policy outlines how we collect, handle, and protect your personal information when you browse and purchase from our store.
      </p>
      <h3 className="font-serif font-bold text-base text-spice-brown">1. Information We Collect</h3>
      <p>
        When you make a purchase or create an account, we collect your name, shipping address, email address, and phone number solely to fulfill delivery and communicate order progress.
      </p>
      <h3 className="font-serif font-bold text-base text-spice-brown">2. Payment Security</h3>
      <p>
        We do not store your credit/debit card numbers or bank account passwords on our servers. All digital transactions are securely routed through RBI-compliant certified payment gateways.
      </p>
      <h3 className="font-serif font-bold text-base text-spice-brown">3. Contact Us</h3>
      <p>
        If you have questions about your personal data, write to us at <span className="font-semibold text-spice-crimson">care@chilikaspices.com</span>.
      </p>
    </div>
  </div>
);

export const TermsPage = () => (
  <div className="min-h-screen bg-spice-cream py-10 sm:py-16">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl p-6 sm:p-10 border border-spice-tan/60 shadow-sm space-y-6 text-xs sm:text-sm text-spice-brown/80 leading-relaxed">
      <div className="flex items-center space-x-3 pb-4 border-b border-spice-tan/40">
        <FileText className="w-8 h-8 text-spice-crimson" />
        <div>
          <h1 className="font-serif font-bold text-2xl text-spice-brown">Terms & Conditions</h1>
          <p className="text-xs text-spice-brown/60">Effective Date: January 2026</p>
        </div>
      </div>
      <p>
        Welcome to Chilika Spices. By placing an order through this website, you agree to comply with the terms set forth below.
      </p>
      <h3 className="font-serif font-bold text-base text-spice-brown">1. Orders & Pricing</h3>
      <p>
        All product prices listed on our store are in Indian Rupees (INR) and inclusive of applicable goods and services taxes. We reserve the right to correct any typographical pricing errors.
      </p>
      <h3 className="font-serif font-bold text-base text-spice-brown">2. Product Authenticity</h3>
      <p>
        We ensure our spices are strictly authentic, food-grade, vegetarian, and unadulterated. Natural agricultural variations in color and aroma may occur between seasonal crop harvests.
      </p>
    </div>
  </div>
);

export const ShippingPolicyPage = () => (
  <div className="min-h-screen bg-spice-cream py-10 sm:py-16">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl p-6 sm:p-10 border border-spice-tan/60 shadow-sm space-y-6 text-xs sm:text-sm text-spice-brown/80 leading-relaxed">
      <div className="flex items-center space-x-3 pb-4 border-b border-spice-tan/40">
        <Truck className="w-8 h-8 text-spice-crimson" />
        <div>
          <h1 className="font-serif font-bold text-2xl text-spice-brown">Shipping & Delivery Policy</h1>
          <p className="text-xs text-spice-brown/60">From Odisha Village Farms to Your Kitchen</p>
        </div>
      </div>
      <h3 className="font-serif font-bold text-base text-spice-brown">1. Dispatch Timeline</h3>
      <p>
        Every order is freshly weighed and packed in vacuum-sealed bags within 24–48 hours of confirmation.
      </p>
      <h3 className="font-serif font-bold text-base text-spice-brown">2. Shipping Charges</h3>
      <p>
        • Orders of ₹499 and above: <strong>FREE Express Shipping</strong><br />
        • Orders under ₹499: Flat fee of ₹49
      </p>
      <h3 className="font-serif font-bold text-base text-spice-brown">3. Delivery Transit Time</h3>
      <p>
        Standard transit takes 3 to 6 working days across India. A live tracking ID (AWB) is assigned once handed over to the courier partner.
      </p>
    </div>
  </div>
);

export const ReturnPolicyPage = () => (
  <div className="min-h-screen bg-spice-cream py-10 sm:py-16">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl p-6 sm:p-10 border border-spice-tan/60 shadow-sm space-y-6 text-xs sm:text-sm text-spice-brown/80 leading-relaxed">
      <div className="flex items-center space-x-3 pb-4 border-b border-spice-tan/40">
        <RotateCcw className="w-8 h-8 text-spice-crimson" />
        <div>
          <h1 className="font-serif font-bold text-2xl text-spice-brown">Return & Refund Policy</h1>
          <p className="text-xs text-spice-brown/60">Our 100% Quality & Freshness Guarantee</p>
        </div>
      </div>
      <h3 className="font-serif font-bold text-base text-spice-brown">1. Perishable Food Safety</h3>
      <p>
        Because spices are edible food products, we do not accept returns on opened packets to maintain safety standards.
      </p>
      <h3 className="font-serif font-bold text-base text-spice-brown">2. Damaged or Wrong Item Guarantee</h3>
      <p>
        If your parcel arrives damaged, broken, or with an incorrect item, please notify us within 48 hours of delivery at <span className="font-semibold text-spice-crimson">care@chilikaspices.com</span> with a photo of the package. We will immediately arrange a free replacement or complete refund.
      </p>
    </div>
  </div>
);
