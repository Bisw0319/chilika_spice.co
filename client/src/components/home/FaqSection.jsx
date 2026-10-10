import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection = ({ faqs = [] }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const defaultFaqs = [
    {
      question: "Where do you deliver?",
      answer: "We deliver across all serviced pin codes throughout India through reliable express courier logistics partners."
    },
    {
      question: "How can I track my order?",
      answer: "You can track your order at any time on our dedicated /track-order page using your unique Order ID (e.g., CHL-2026-000001) and registered phone or email."
    },
    {
      question: "What payment methods are available?",
      answer: "We support Cash on Delivery (COD) as well as online options including UPI (PhonePe, Google Pay, Paytm), Net Banking, and Cards."
    },
    {
      question: "How long does delivery take?",
      answer: "Orders are freshly dispatched within 24-48 hours. Depending on your location, delivery usually takes 3 to 6 business days."
    },
    {
      question: "How can I contact Chilika Spices?",
      answer: "Reach out to our customer care at care@chilikaspices.com or call/WhatsApp +91 96686 59633 from Monday to Saturday, 9 AM to 7 PM."
    },
    {
      question: "What is your return policy?",
      answer: "If your spice package arrives damaged or you received an incorrect item, notify us within 48 hours of delivery with a photo for an immediate hassle-free replacement or refund."
    }
  ];

  const items = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <section className="py-12 sm:py-16 bg-spice-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-spice-turmeric uppercase tracking-widest block mb-1">
            Questions & Answers
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-spice-brown tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-spice-brown/70 mt-1.5">
            Everything you need to know about our fresh spices, delivery, and orders.
          </p>
        </div>

        <div className="space-y-3.5">
          {items.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-spice-tan/60 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between space-x-4 focus:outline-none"
                >
                  <span className="font-serif font-semibold text-sm sm:text-base text-spice-brown">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-spice-crimson shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-spice-brown/75 border-t border-spice-tan/20 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
