import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const allFaqs = [
  {
    category: 'Ordering & Delivery',
    items: [
      {
        q: 'Where do you deliver across India?',
        a: 'We deliver to over 19,000+ pin codes across all states and union territories in India using reliable air and surface express courier networks.'
      },
      {
        q: 'What is the delivery time?',
        a: 'Orders are freshly weighed and dispatched within 24-48 hours. Metro destinations generally receive delivery in 3-4 days, while non-metro cities and rural areas take 4-6 business days.'
      },
      {
        q: 'How can I track my order?',
        a: 'Use our dedicated /track-order page by entering your unique Order ID (e.g. CHL-2026-000001) and phone number to see live status updates.'
      },
      {
        q: 'Are there any shipping charges?',
        a: 'We offer FREE express delivery on all orders above ₹499. For smaller orders below ₹499, a nominal standard fee of ₹49 is added.'
      }
    ]
  },
  {
    category: 'Product Purity & Quality',
    items: [
      {
        q: 'Are Chilika Spices unadulterated and pure?',
        a: 'Yes. Every batch is slow stone-ground from selected whole seeds and roots without any added artificial food coloring, starch, preservatives, or artificial fragrances.'
      },
      {
        q: 'Why does your turmeric powder look so vibrant?',
        a: 'Our turmeric is sourced from the highland regions of Kandhamal in Odisha, renowned globally for naturally high curcumin levels and deep golden hue.'
      },
      {
        q: 'How should I store my spices after opening the pack?',
        a: 'Transfer spices into dry, airtight glass jars or stainless steel containers and keep them in a cool, dark kitchen cupboard away from direct stove heat and steam.'
      }
    ]
  },
  {
    category: 'Payments & Returns',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept Cash on Delivery (COD) as well as online UPI (Google Pay, PhonePe, Paytm), Net Banking, and Credit/Debit cards.'
      },
      {
        q: 'What is your replacement or refund policy?',
        a: 'If a spice pack is received broken or damaged, report it to care@chilikaspices.com within 48 hours of delivery with a photo. We will immediately ship a replacement or issue a 100% full refund.'
      }
    ]
  }
];

export const FaqPage = () => {
  const [openItems, setOpenItems] = useState({ '0-0': true, '1-0': true });

  const toggleItem = (key) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-spice-cream py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="w-12 h-12 rounded-full bg-spice-sand border border-spice-tan text-spice-crimson flex items-center justify-center mx-auto mb-3">
            <HelpCircle className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-spice-turmeric uppercase tracking-widest block mb-1">
            Help Center
          </span>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-spice-brown tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-spice-brown/70 mt-1.5">
            Clear answers about Chilika Spices quality, shipping, and doorstep delivery.
          </p>
        </div>

        <div className="space-y-8">
          {allFaqs.map((section, sIdx) => (
            <div key={sIdx} className="space-y-3">
              <h2 className="font-serif font-bold text-lg text-spice-brown px-1">
                {section.category}
              </h2>
              <div className="space-y-2.5">
                {section.items.map((item, iIdx) => {
                  const key = `${sIdx}-${iIdx}`;
                  const isOpen = !!openItems[key];
                  return (
                    <div
                      key={iIdx}
                      className="bg-white rounded-2xl border border-spice-tan/60 overflow-hidden shadow-2xs transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(key)}
                        className="w-full px-5 py-4 text-left flex items-center justify-between space-x-4 focus:outline-none"
                      >
                        <span className="font-serif font-semibold text-xs sm:text-sm text-spice-brown">
                          {item.q}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-spice-crimson shrink-0 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-spice-brown/80 border-t border-spice-tan/20 leading-relaxed">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-12 p-6 bg-white rounded-3xl border border-spice-tan/60 text-center space-y-3 shadow-sm">
          <h3 className="font-serif font-bold text-base text-spice-brown">
            Still Have Questions?
          </h3>
          <p className="text-xs text-spice-brown/70 max-w-sm mx-auto">
            Our Odisha village customer care team is always happy to talk spices and recipes.
          </p>
          <div className="flex justify-center gap-3 pt-1">
            <Link
              to="/contact"
              className="bg-spice-crimson hover:bg-spice-deepRed text-white px-6 py-2.5 rounded-full text-xs font-bold transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
