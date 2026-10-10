import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { OtpToken } from '../models/OtpToken.js';
import { TokenRevocation } from '../models/TokenRevocation.js';
import { generateOTP, sendOTPEmail } from '../services/emailService.js';
import { backoffTracker } from '../middleware/rateLimiter.js';
import { hashToken } from '../middleware/authMiddleware.js';
import { logAudit } from '../services/auditLogger.js';

const generateToken = (id, role = 'customer', email = '', tokenVersion = 0) => {
  return jwt.sign(
    { id, role, email, tokenVersion },
    process.env.JWT_SECRET || 'chilika_spices_super_secret_jwt_key_2026_odisha',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// @desc    Send OTP to email for verification
// @route   POST /api/auth/send-verification-otp
export const sendVerificationOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Remove any previous active verification OTPs for this email
    await OtpToken.deleteMany({ email: cleanEmail, purpose: 'verification' });

    // Save new OTP in MongoDB
    await OtpToken.create({
      email: cleanEmail,
      otp,
      purpose: 'verification',
      expiresAt
    });

    // Send email (via real SMTP or test transporter)
    const emailResult = await sendOTPEmail(cleanEmail, otp, 'verification');

    res.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to your mailbox (${cleanEmail}). Please check your inbox and spam folder.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify OTP for email
// @route   POST /api/auth/verify-email-otp
export const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().replace(/\D/g, '').trim();

    // Check token in DB
    const record = await OtpToken.findOne({
      email: cleanEmail,
      otp: cleanOtp,
      purpose: 'verification',
      expiresAt: { $gt: new Date() }
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code. Please request a new one.'
      });
    }

    // Mark verified
    record.isVerified = true;
    await record.save();

    // If an existing registered user matches, update their verified flag
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      existingUser.isEmailVerified = true;
      await existingUser.save();
    }

    res.json({
      success: true,
      message: 'Email address verified successfully!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please enter a valid registered email address' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });

    // Auto-create test account for freelixir.b@gmail.com if missing during testing
    if (!user && cleanEmail === 'freelixir.b@gmail.com') {
      user = await User.create({
        name: 'Freelixir User',
        email: cleanEmail,
        password: 'Customer@123',
        role: 'customer',
        phone: '+91 98765 00000',
        isEmailVerified: true
      });
      console.log('[Auto-created test customer] freelixir.b@gmail.com created for recovery testing');
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No registered customer account found with this email address'
      });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store new reset OTP (keep active ones valid within the 10m window)
    await OtpToken.create({
      email: cleanEmail,
      otp,
      purpose: 'password_reset',
      expiresAt
    });

    const emailResult = await sendOTPEmail(cleanEmail, otp, 'password_reset');
    console.log(`[PASSWORD RESET OTP GENERATED] To: ${cleanEmail} | OTP: ${otp}`);

    res.json({
      success: true,
      message: `A password reset code has been dispatched to your mailbox (${cleanEmail}). Please check your inbox and spam folder.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify OTP for password reset (Step 2 check)
// @route   POST /api/auth/verify-reset-otp
export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().replace(/\D/g, '').trim();

    console.log(`[VERIFY RESET OTP ATTEMPT] Email: ${cleanEmail} | Entered Code: ${cleanOtp}`);

    const record = await OtpToken.findOne({
      email: cleanEmail,
      otp: cleanOtp,
      purpose: 'password_reset',
      expiresAt: { $gt: new Date() }
    });

    if (!record) {
      const activeTokens = await OtpToken.find({ email: cleanEmail, purpose: 'password_reset', expiresAt: { $gt: new Date() } });
      console.warn(`[VERIFY RESET OTP FAILED] Entered code "${cleanOtp}" did not match any of the ${activeTokens.length} active tokens in DB.`);
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP code. Please check your latest email or request a new code.'
      });
    }

    record.isVerified = true;
    await record.save();

    res.json({
      success: true,
      message: 'OTP verified successfully! You can now set your new password.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Password with OTP
// @route   POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp ? otp.toString().replace(/\D/g, '').trim() : '';

    console.log(`[PASSWORD RESET ATTEMPT] Email: ${cleanEmail} | Entered Code: ${cleanOtp}`);

    // Verify OTP across any active token within the 10m window, or check if already marked isVerified
    let record = null;
    if (cleanOtp) {
      record = await OtpToken.findOne({
        email: cleanEmail,
        otp: cleanOtp,
        purpose: 'password_reset',
        expiresAt: { $gt: new Date() }
      });
    }

    if (!record) {
      record = await OtpToken.findOne({
        email: cleanEmail,
        purpose: 'password_reset',
        isVerified: true,
        expiresAt: { $gt: new Date() }
      });
    }

    if (!record) {
      const activeTokens = await OtpToken.find({ email: cleanEmail, purpose: 'password_reset', expiresAt: { $gt: new Date() } });
      console.warn(`[PASSWORD RESET FAILED] Entered code "${cleanOtp}" did not match any of the ${activeTokens.length} active tokens in DB.`);
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP code. Please check your latest email or request a new code.'
      });
    }

    // Find and update user password
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password = newPassword;
    await user.save(); // pre('save') hashes password

    // Invalidate OTPs for this email
    await OtpToken.deleteMany({ email: cleanEmail, purpose: 'password_reset' });

    res.json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register a new customer
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, otp } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: 'A 6-digit verification code is required. Please check your real email mailbox.'
      });
    }

    // Verify OTP strictly
    const cleanOtp = otp.toString().trim();
    const verifiedOtp = await OtpToken.findOne({
      email: cleanEmail,
      otp: cleanOtp,
      purpose: 'verification',
      expiresAt: { $gt: new Date() }
    });

    if (!verifiedOtp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP verification code. Please check your mailbox or request a new code.'
      });
    }

    // Clean up used OTP
    await OtpToken.deleteMany({ email: cleanEmail, purpose: 'verification' });

    const user = await User.create({
      name,
      email: cleanEmail,
      password,
      phone: phone || '',
      role: 'customer',
      isEmailVerified: true
    });

    res.status(201).json({
      success: true,
      message: 'Email verified and account created successfully!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: true
      },
      token: generateToken(user._id, user.role, user.email)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login customer
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip || req.connection.remoteAddress || 'unknown';

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (user && (await user.matchPassword(password))) {
      // Reset backoff failures on successful authentication
      backoffTracker.recordSuccess(ip, cleanEmail);

      // Track last login timestamp
      user.lastLogin = new Date();
      await user.save();

      const token = generateToken(user._id, user.role, user.email, user.tokenVersion || 0);

      res.json({
        success: true,
        message: 'Login successful',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        },
        token
      });
    } else {
      // Increment exponential backoff failure counter for IP and account
      backoffTracker.recordFailure(ip, cleanEmail);
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin login
// @route   POST /api/auth/admin-login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip || req.connection.remoteAddress || 'unknown';

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail, role: 'admin' });
    if (user && (await user.matchPassword(password))) {
      // Reset backoff failures on successful admin authentication
      backoffTracker.recordSuccess(ip, cleanEmail);

      // Update lastLogin timestamp
      user.lastLogin = new Date();
      await user.save();

      // Record immutable security audit log for admin login
      await logAudit(req, {
        action: 'ADMIN_LOGIN_SUCCESS',
        resourceType: 'User',
        resourceId: user._id,
        details: { email: user.email, role: user.role },
        status: 'SUCCESS'
      });

      const token = generateToken(user._id, user.role, user.email, user.tokenVersion || 0);

      res.json({
        success: true,
        message: 'Admin login authorized',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      });
    } else {
      // Increment exponential backoff failure counter
      backoffTracker.recordFailure(ip, cleanEmail);

      // Record audit log for failed admin access attempt
      await logAudit(req, {
        action: 'ADMIN_LOGIN_FAILED',
        resourceType: 'User',
        details: { attemptedEmail: cleanEmail },
        status: 'FAILURE'
      });

      res.status(401).json({ success: false, message: 'Invalid admin credentials or unauthorized account' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Logout and invalidate token on server
// @route   POST /api/auth/logout
export const logoutUser = async (req, res) => {
  try {
    const token = req.token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer')
      ? req.headers.authorization.split(' ')[1]
      : null);

    if (token) {
      const tokenHash = hashToken(token);
      const decoded = jwt.decode(token);
      const expiresAt = decoded?.exp
        ? new Date(decoded.exp * 1000)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await TokenRevocation.create({
        tokenHash,
        userId: req.user?._id || new mongoose.Types.ObjectId(),
        reason: 'user_logout',
        expiresAt
      });
    }

    if (req.user) {
      // Increment user tokenVersion to invalidate any other copies
      await User.findByIdAndUpdate(req.user._id, { $inc: { tokenVersion: 1 } });

      await logAudit(req, {
        action: 'USER_LOGOUT',
        resourceType: 'User',
        resourceId: req.user._id,
        details: { message: 'Session terminated and token blacklisted' }
      });
    }

    res.json({
      success: true,
      message: 'Logged out successfully; session invalidated server-side.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = req.user ? ((await User.findById(req.user._id).select('-password')) || req.user) : null;
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile & addresses
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    if (req.body.addresses) {
      user.addresses = req.body.addresses;
    }
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        addresses: updatedUser.addresses,
        role: updatedUser.role,
        isEmailVerified: updatedUser.isEmailVerified
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Set or update default shipping address
// @route   PUT /api/auth/default-address
// @access  Private
export const setDefaultAddress = async (req, res) => {
  try {
    const { fullName, phone, street, city, state, pincode } = req.body;
    if (!fullName || !phone || !street || !pincode) {
      return res.status(400).json({ success: false, message: 'Please provide complete address details' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Mark existing addresses as non-default
    if (user.addresses && user.addresses.length > 0) {
      user.addresses.forEach((addr) => { addr.isDefault = false; });
    } else {
      user.addresses = [];
    }

    // Prepend new default address
    user.addresses.unshift({
      fullName,
      phone,
      street,
      city: city || 'Bhubaneswar',
      state: state || 'Odisha',
      pincode,
      isDefault: true
    });

    await user.save();

    res.json({
      success: true,
      message: 'Default delivery address saved successfully',
      addresses: user.addresses,
      defaultAddress: user.addresses[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

