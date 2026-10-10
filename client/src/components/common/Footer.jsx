import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { InstagramIcon, YoutubeIcon, FacebookIcon } from './SocialIcons';

export const Footer = () => {
  const { content } = useContent();

  const phone = content?.contactPhone || "+91 96686 59633";
  const email = content?.contactEmail || "care@chilikaspices.com";
  const address = content?.contactAddress || "Chilika Spice Co., Old Town, Khordha / Puri District, Odisha, India";
  const aboutText = content?.footerAboutText || "Authentic spices inspired by the flavours, traditions and kitchens of Odisha. Sourced directly from village growers and stone-ground to preserve every ounce of pure aroma.";

  const instagramUrl = content?.instagramUrl || "https://instagram.com";
  const youtubeUrl = content?.youtubeUrl || "https://youtube.com";
  const facebookUrl = content?.facebookUrl || "https://facebook.com";

  return (
    <footer className="bg-spice-charcoal text-spice-sand pt-12 pb-24 md:pb-12 border-t border-spice-brown/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/images/brand/chilika-logo.jpg"
                alt="Chilika Spices"
                className="h-12 w-auto object-contain rounded-md border border-spice-gold/50 shadow-sm"
              />
              <div>
                <span className="font-serif font-bold text-white text-lg tracking-wider block">
                  CHILIKA SPICES
                </span>
                <span className="text-xs text-spice-turmeric tracking-widest uppercase">
                  From village to your kitchen
                </span>
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-spice-sand/70 leading-relaxed max-w-sm">
              {aboutText}
            </p>

            {/* Social Media Links */}
            <div className="pt-1">
              <p className="text-xs font-bold text-white tracking-wider uppercase mb-2">Follow Our Journey</p>
              <div className="flex items-center space-x-3">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#E1306C] hover:text-white flex items-center justify-center text-spice-sand/80 transition-colors shadow-2xs"
                  title="Follow Chilika Spices on Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#FF0000] hover:text-white flex items-center justify-center text-spice-sand/80 transition-colors shadow-2xs"
                  title="Subscribe to Chilika Spices on YouTube"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#1877F2] hover:text-white flex items-center justify-center text-spice-sand/80 transition-colors shadow-2xs"
                  title="Connect with Chilika Spices on Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="pt-1 flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center space-x-2 text-spice-sand/80">
                <span className="veg-badge" />
                <span className="text-[11px]">100% Vegetarian</span>
              </div>
              <div className="inline-flex items-center space-x-1.5 bg-white/95 px-2 py-0.5 rounded border border-white/20 shadow-2xs">
                <img
                  src="/images/brand/fssai-logo.png"
                  alt="FSSAI"
                  className="h-3.5 w-auto object-contain"
                />
                <span className="text-[10px] font-bold text-gray-800 tracking-wide uppercase">
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider mb-4 border-b border-spice-gold/30 pb-1.5 w-max">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-spice-sand/80">
              <li>
                <Link to="/" className="hover:text-spice-yellow transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-spice-yellow transition-colors">All Spices</Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-spice-yellow transition-colors">Categories</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-spice-yellow transition-colors">Our Story</Link>
              </li>
              <li>
                <Link to="/track-order" className="text-spice-yellow font-medium hover:underline">Track Your Order</Link>
              </li>
            </ul>
          </div>

          {/* Customer Support & Policies */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider mb-4 border-b border-spice-gold/30 pb-1.5 w-max">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-spice-sand/80">
              <li>
                <Link to="/faq" className="hover:text-spice-yellow transition-colors">Frequently Asked Questions</Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-spice-yellow transition-colors">Shipping Policy</Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-spice-yellow transition-colors">Return & Refund Policy</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-spice-yellow transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="hover:text-spice-yellow transition-colors">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider mb-4 border-b border-spice-gold/30 pb-1.5 w-max">
              Connect With Us
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-spice-sand/80">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-spice-turmeric shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-spice-turmeric shrink-0" />
                <span>{phone}</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-spice-turmeric shrink-0" />
                <span>{email}</span>
              </li>
              <li className="pt-2">
                <Link
                  to="/admin/login"
                  className="text-[11px] text-spice-sand/40 hover:text-spice-yellow transition-colors flex items-center space-x-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-spice-sand/60 space-y-3 sm:space-y-0">
          <p>© 2026 Chilika Spices. All rights reserved.</p>

          <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            <span className="bg-white px-1.5 py-0.5 rounded flex items-center">
              <img
                src="/images/brand/fssai-logo.png"
                alt="FSSAI"
                className="h-3 w-auto object-contain"
              />
            </span>
            <span className="text-[11px] text-spice-sand/80 font-medium">
              FSSAI Verified
            </span>
          </div>

          <p className="flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-red-500 fill-current inline" />
            <span>for authentic Indian kitchens</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
