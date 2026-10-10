const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('chilika_token');
  
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      cache: 'no-store',
      ...options,
      headers,
    });

  } catch (netErr) {
    throw new Error('Unable to connect to server. Please ensure the backend server is running.');
  }

  // Safely parse JSON response
  const rawText = await response.text();
  let data = {};
  if (rawText && rawText.trim().length > 0) {
    try {
      data = JSON.parse(rawText);
    } catch {
      data = { message: rawText };
    }
  }

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status} (${response.statusText || 'Error'})`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
};

export const api = {
  // Auth
  register: (userData) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  adminLogin: (credentials) => apiRequest('/auth/admin-login', { method: 'POST', body: JSON.stringify(credentials) }),
  getMe: () => apiRequest('/auth/me'),
  updateProfile: (profileData) => apiRequest('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  sendVerificationOTP: (email) => apiRequest('/auth/send-verification-otp', { method: 'POST', body: JSON.stringify({ email }) }),
  verifyEmailOTP: (email, otp) => apiRequest('/auth/verify-email-otp', { method: 'POST', body: JSON.stringify({ email, otp }) }),
  forgotPassword: (email) => apiRequest('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  verifyResetOTP: (email, otp) => apiRequest('/auth/verify-reset-otp', { method: 'POST', body: JSON.stringify({ email, otp }) }),
  resetPassword: (email, otp, newPassword) => apiRequest('/auth/reset-password', { method: 'POST', body: JSON.stringify({ email, otp, newPassword }) }),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),

  // Products
  getProducts: (params = '') => apiRequest(`/products${params ? `?${params}` : ''}`),
  getProductBySlug: (slug) => apiRequest(`/products/slug/${slug}`),
  getProductById: (id) => apiRequest(`/products/${id}`),
  getBestSellers: () => apiRequest('/products/bestsellers'),
  getFeaturedProducts: () => apiRequest('/products/featured'),
  getRelatedProducts: (id) => apiRequest(`/products/related/${id}`),

  // Categories
  getCategories: () => apiRequest('/categories'),

  // Orders
  createOrder: (orderData) => apiRequest('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  trackOrder: (orderId, query = '') => apiRequest(`/orders/track/${orderId}${query ? `?query=${encodeURIComponent(query)}` : ''}`),
  getMyOrders: () => apiRequest('/orders/my-orders'),
  getOrderById: (id) => apiRequest(`/orders/${id}`),

  // Coupons
  applyCoupon: (code, cartTotal) => apiRequest('/coupons/apply', { method: 'POST', body: JSON.stringify({ code, cartTotal }) }),

  // Reviews
  getProductReviews: (productId) => apiRequest(`/reviews/product/${productId}`),
  getFeaturedReviews: () => apiRequest('/reviews/featured'),
  submitReview: (reviewData) => apiRequest('/reviews', { method: 'POST', body: JSON.stringify(reviewData) }),

  // Newsletter
  subscribeNewsletter: (email) => apiRequest('/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email }) }),

  // Contact
  sendContactMessage: (contactData) => apiRequest('/contact', { method: 'POST', body: JSON.stringify(contactData) }),

  // Homepage
  getHomepageContent: () => apiRequest('/homepage'),

  // Admin
  getAdminStats: () => apiRequest('/admin/dashboard'),
  getAdminCustomers: () => apiRequest('/admin/customers'),
  getAdminOrders: (params = '') => apiRequest(`/orders${params ? `?${params}` : ''}`),
  updateOrderStatus: (id, statusData) => apiRequest(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify(statusData) }),
  createProduct: (productData) => apiRequest('/products', { method: 'POST', body: JSON.stringify(productData) }),
  updateProduct: (id, productData) => apiRequest(`/products/${id}`, { method: 'PUT', body: JSON.stringify(productData) }),
  deleteProduct: (id) => apiRequest(`/products/${id}`, { method: 'DELETE' }),
  createCategory: (catData) => apiRequest('/categories', { method: 'POST', body: JSON.stringify(catData) }),
  updateCategory: (id, catData) => apiRequest(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(catData) }),
  deleteCategory: (id) => apiRequest(`/categories/${id}`, { method: 'DELETE' }),
  getAdminCoupons: () => apiRequest('/coupons'),
  createCoupon: (couponData) => apiRequest('/coupons', { method: 'POST', body: JSON.stringify(couponData) }),
  updateCoupon: (id, couponData) => apiRequest(`/coupons/${id}`, { method: 'PUT', body: JSON.stringify(couponData) }),
  deleteCoupon: (id) => apiRequest(`/coupons/${id}`, { method: 'DELETE' }),
  getAdminReviews: () => apiRequest('/reviews'),
  toggleApproveReview: (id) => apiRequest(`/reviews/${id}/approve`, { method: 'PUT' }),
  updateHomepageContent: (content) => apiRequest('/homepage', { method: 'PUT', body: JSON.stringify(content) }),

  // Payment Configuration & Verification
  getPaymentConfig: () => apiRequest('/payment/config'),
  updatePaymentConfig: (configData) => apiRequest('/payment/config', { method: 'PUT', body: JSON.stringify(configData) }),
  verifyOrderPayment: (id, note = '') => apiRequest(`/payment/verify-order/${id}`, { method: 'PUT', body: JSON.stringify({ note }) }),

  // Store Settings (Delivery Fees, Thresholds, Offers, Logistics)
  getStoreSettings: () => apiRequest('/settings'),
  updateStoreSettings: (settingsData) => apiRequest('/settings', { method: 'PUT', body: JSON.stringify(settingsData) }),
  checkPincodeServiceability: (pincode) => apiRequest(`/settings/check-pincode/${pincode}`),
  sendTestEmail: (targetEmail) => apiRequest('/settings/test-email', { method: 'POST', body: JSON.stringify({ targetEmail }) }),

  // Default Address
  saveDefaultAddress: (addressData) => apiRequest('/auth/default-address', { method: 'PUT', body: JSON.stringify(addressData) }),

  // Security Audit Logs (Admin only)
  getAuditLogs: (params = '') => apiRequest(`/admin/audit-logs${params ? `?${params}` : ''}`),

  // Image Uploads from local files
  uploadImages: async (files) => {
    const formData = new FormData();
    const token = localStorage.getItem('chilika_token');

    if (files instanceof FileList || Array.isArray(files)) {
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
    } else {
      formData.append('images', files);
    }

    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let response;
    try {
      response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers,
        body: formData
      });
    } catch (netErr) {
      throw new Error('Upload failed: Unable to connect to backend server.');
    }

    const rawText = await response.text();
    let data = {};
    if (rawText && rawText.trim().length > 0) {
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { message: rawText };
      }
    }

    if (!response.ok) {
      throw new Error(data.message || `Upload failed with status ${response.status}`);
    }
    return data;
  }
};
