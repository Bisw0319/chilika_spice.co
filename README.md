# 🌶️ Chilika Spices - Full-Stack E-Commerce Platform

> **"From village to your kitchen"** — Authentic Odisha Spices, Traditional Blends, Badi & Coastal Flavors.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248.svg)](https://mongoosejs.com/)
[![OWASP Hardened](https://img.shields.io/badge/OWASP-Hardened-crimson.svg)](https://owasp.org/)

---

## 📖 Overview

**Chilika Spices** is a production-ready, full-stack MERN e-commerce application tailored for regional spice brands. It offers a customer storefront optimized for mobile devices, interactive Indian payment flows (Free Direct UPI QR & Deeplinking, Cash on Delivery, and Razorpay), real-time order tracking, and an administrative portal with security hardening and live audit logging.

---

## ✨ Features

### 🛒 Customer Storefront
- **Mobile-First Experience**: Horizontal scrolling carousels, expandable navigation search bar, sticky bottom navigation bar, and animated announcement ticker.
- **Odisha Heritage Products**: Turmeric (Haldi), Mirchi Powder, Homemade Garam Masala, Panch Phoron, Odia Masala Badi, Traditional Pure Biri Badi, Coastal Fish Curry Blend (Machha Besara), and more.
- **Smart Cart & Checkout**:
  - Saved & default customer delivery addresses.
  - Live pincode serviceability checker.
  - Coupon discount engine (`FIRST10`, `SPICE15`, `FESTIVE20`).
  - Dynamic free shipping progress bar & configurable threshold.
- **Payment Integration**:
  - Zero-commission direct UPI QR codes with one-tap payment deeplinking (PhonePe, Google Pay, Paytm, BHIM, Cred).
  - Cash on Delivery (COD) with verification.
  - Razorpay online gateway support.
- **Order Tracking & Invoices**:
  - Step-by-step shipment timeline (Ordered, Processing, Shipped, Delivered).
  - Clean, dedicated customer printable invoice view.

### 🛡️ Administrative Portal
- **Dashboard Analytics**: Revenue overview, total orders, product inventory metrics, and customer insights.
- **Product & Category Management**: Dynamic variants (100g, 250g, 500g, 1kg), inventory management, and image upload with binary magic-byte inspection.
- **Orders & Logistics**: Order status updates, customer details, and warehouse delivery packing slip / shipping invoice format.
- **Delivery & Offers Control**: Manage delivery charges, free delivery thresholds, serviceability pincodes, promotional banners, and notification emails.
- **Payment & UPI Configuration**: Live admin control over UPI ID, Payee Name, QR display, and gateway credentials.
- **Homepage Section Content Manager**: Full CMS control over testimonials, "Why Cooks Choose Chilika Spices", and Instagram / community gallery.
- **Security Audit Ledger**: Immutable OWASP compliance log tracking administrative logins, privilege actions, file uploads, and session events.

---

## 🔒 Security Architecture (OWASP Top 10)

- **Authentication & Token Revocation**: JWT with `tokenVersion` session tracking and MongoDB TTL-indexed `TokenRevocation` blacklist on logout.
- **Strict Server-Side RBAC**: Role verification against MongoDB; removal of unauthenticated defaults; protection against horizontal & vertical privilege escalation (BOLA/IDOR).
- **Injection Defense**: Recursive NoSQL operator stripping (`$`, `.`) from request bodies/queries and strict hex `ObjectId` parameter validation.
- **Tiered Rate Limiting**: Dedicated rate limiters on auth, admin login with exponential backoff, sensitive mutations, and public read APIs.
- **File Upload Protection**: Binary magic-byte header validation (JPEG, PNG, GIF, WebP, AVIF), strict 5MB size ceiling, cryptographically randomized filenames, and CSP sandbox headers.
- **Security Headers**: Powered by `helmet` with HSTS (1 year + preload), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and custom CSP.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas connection string; fallback in-memory database runs automatically if MongoDB is not detected)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Bisw0319/chilika_spice.co.git
   cd chilika_spice.co
   ```

2. **Install dependencies**:
   ```bash
   # Install root dependencies
   npm install

   # Install server dependencies
   cd server && npm install

   # Install client dependencies
   cd ../client && npm install
   cd ..
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` inside the `server/` directory:
   ```bash
   cp server/.env.example server/.env
   ```

4. **Start the Application**:
   ```bash
   # Runs both server (port 5000) and client (port 5173) concurrently
   npm run dev
   ```

---

## 📂 Project Structure

```
chilika_spice.co/
├── client/                     # Vite + React Frontend
│   ├── public/                 # Static assets & brand media
│   └── src/
│       ├── components/         # Reusable UI & section components
│       ├── context/            # Auth, Cart, Wishlist, Address contexts
│       ├── layouts/            # MainLayout and AdminLayout
│       ├── pages/              # Customer & Admin pages
│       └── services/           # Axios API client & endpoints
├── server/                     # Node.js + Express Backend
│   ├── config/                 # DB connection & database seeds
│   ├── controllers/            # Route controllers
│   ├── middleware/             # Auth, RBAC, Sanitizer, Rate Limiters
│   ├── models/                 # Mongoose models & audit schemas
│   ├── routes/                 # Express API routes
│   └── services/               # Audit logger, mailer, and security helpers
├── package.json
└── README.md
```

---

## 📜 License

Private © Chilika Spices. All Rights Reserved.
