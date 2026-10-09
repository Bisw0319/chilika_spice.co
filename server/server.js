import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seed/seedData.js';

import path from 'path';
import { fileURLToPath } from 'url';

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import homepageRoutes from './routes/homepageRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import storeSettingsRoutes from './routes/storeSettingsRoutes.js';
import {
  publicRateLimiter,
  authenticatedRateLimiter
} from './middleware/rateLimiter.js';
import { noSqlSanitizer } from './middleware/securitySanitizer.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000; // Chilika server

// OWASP Security Headers via Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    xFrameOptions: { action: 'deny' }, // Clickjacking defense
    xContentTypeOptions: true, // MIME sniffing defense
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    strictTransportSecurity: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        connectSrc: ["'self'", 'http:', 'https:'],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"]
      }
    }
  })
);

app.use(cors({
  origin: true,
  credentials: true,
}));

// Body Parsers with limits
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Lightweight Cookie Parser for HttpOnly Session Tokens
app.use((req, res, next) => {
  req.cookies = {};
  if (req.headers.cookie) {
    req.headers.cookie.split(';').forEach((cookie) => {
      const parts = cookie.split('=');
      if (parts.length >= 2) {
        req.cookies[parts[0].trim()] = decodeURIComponent(parts.slice(1).join('=').trim());
      }
    });
  }
  next();
});

// NoSQL Injection Sanitizer across body, query, and params
app.use(noSqlSanitizer);

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'Chilika Spices',
    tagline: 'From village to your kitchen',
    timestamp: new Date().toISOString()
  });
});

// Serve static uploads strictly with isolated headers (no script execution, nosniff, sandboxed)
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    dotfiles: 'ignore',
    index: false,
    redirect: false,
    setHeaders: (res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
      res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    }
  })
);

// API Routes with Tiered Rate Limiting
app.use('/api/auth', authRoutes); // Auth limiter + exponential backoff inside authRoutes
app.use('/api/products', publicRateLimiter, productRoutes);
app.use('/api/categories', publicRateLimiter, categoryRoutes);
app.use('/api/orders', authenticatedRateLimiter, orderRoutes);
app.use('/api/coupons', publicRateLimiter, couponRoutes);
app.use('/api/reviews', publicRateLimiter, reviewRoutes);
app.use('/api/newsletter', publicRateLimiter, newsletterRoutes);
app.use('/api/homepage', publicRateLimiter, homepageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', publicRateLimiter, contactRoutes);
app.use('/api/upload', uploadRoutes); // Authenticated + magic-byte content validated
app.use('/api/payment', publicRateLimiter, paymentRoutes);
app.use('/api/settings', publicRateLimiter, storeSettingsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[ServerError]', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Start Server and Connect DB
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`  CHILIKA SPICES API SERVER RUNNING ON PORT ${PORT}`);
      console.log(`  Tagline: "From village to your kitchen"`);
      console.log(`  Admin Email: ${process.env.ADMIN_EMAIL || 'admin@chilikaspices.com'}`);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('[ServerStart] Fatal error starting server:', error);
    process.exit(1);
  }
};

startServer();
