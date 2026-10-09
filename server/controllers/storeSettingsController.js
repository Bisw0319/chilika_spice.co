import { StoreSettings } from '../models/StoreSettings.js';
import { HomepageContent } from '../models/HomepageContent.js';
import { sendTestEmail } from '../services/emailService.js';
import { logAudit } from '../services/auditLogger.js';

// Helper to get or create default settings
export const getOrCreateDefaultStoreSettings = async () => {
  let settings = await StoreSettings.findOne();
  if (!settings) {
    settings = await StoreSettings.create({
      standardShippingFee: 49,
      freeShippingThreshold: 499,
      expressShippingFee: 99,
      codExtraFee: 0,
      estimatedDeliveryDays: '3–5 Business Days',
      shippingNotice: 'Free Express Shipping on all orders above ₹499 across India',
      announcementActive: true,
      announcementText: 'Authentic spices inspired by the kitchens of Odisha • Free shipping on orders above ₹499',
      topBannerOfferCode: 'CHILIKA10',
      topBannerOfferText: 'Flat 10% OFF on your spice order with coupon code CHILIKA10',
      isOfferActive: true,
      courierPartner: 'Express Logistics',
      shipperName: 'Chilika Spices Pvt. Ltd.',
      shipperPhone: '+91 96686 59633',
      shipperAddress: 'Plot 108, Chilika Coastal Road, Balugaon, Dist: Khordha',
      shipperCity: 'Chilika',
      shipperState: 'Odisha',
      shipperPincode: '752030',
      gstNumber: '21AABCC1234D1Z8',
      fssaiNumber: '12026001000888',
      hubCode: 'HUB-OD-BBI01',
      pincodeControlMode: 'all_india',
      serviceablePincodes: ['751001', '751002', '751003', '751024', '752030', '752054', '753001', '756001', '760001'],
      serviceablePrefixes: ['75', '76'],
      serviceableMessage: '✓ Express delivery available (3–5 business days)',
      nonServiceableMessage: '✕ Delivery is currently not available to this pincode',
      adminNotificationEmail: 'freelixir.b@gmail.com',
      orderAlertEmails: 'freelixir.b@gmail.com, biswajitbaral193@gmail.com',
      supportEmail: 'care@chilikaspices.com',
      sendCustomerReceipt: true,
      sendAdminOrderAlert: true
    });
  }
  return settings;
};

// @desc    Get store settings (sanitized for public, complete for admin)
// @route   GET /api/settings
export const getStoreSettings = async (req, res) => {
  try {
    const rawSettings = await getOrCreateDefaultStoreSettings();
    const isAdminUser = req.user && req.user.role === 'admin';

    // If caller is an authenticated admin, return full configuration including notification emails
    if (isAdminUser) {
      return res.json({
        success: true,
        settings: rawSettings
      });
    }

    // For public customers and web inspection, strictly sanitize and omit internal notification email configs
    const sanitizedSettings = {
      standardShippingFee: rawSettings.standardShippingFee,
      freeShippingThreshold: rawSettings.freeShippingThreshold,
      expressShippingFee: rawSettings.expressShippingFee,
      codExtraFee: rawSettings.codExtraFee,
      estimatedDeliveryDays: rawSettings.estimatedDeliveryDays,
      shippingNotice: rawSettings.shippingNotice,
      announcementActive: rawSettings.announcementActive,
      announcementText: rawSettings.announcementText,
      topBannerOfferCode: rawSettings.topBannerOfferCode,
      topBannerOfferText: rawSettings.topBannerOfferText,
      isOfferActive: rawSettings.isOfferActive,
      courierPartner: rawSettings.courierPartner,
      shipperName: rawSettings.shipperName,
      shipperCity: rawSettings.shipperCity,
      shipperState: rawSettings.shipperState,
      pincodeControlMode: rawSettings.pincodeControlMode,
      serviceablePincodes: rawSettings.serviceablePincodes,
      serviceablePrefixes: rawSettings.serviceablePrefixes,
      serviceableMessage: rawSettings.serviceableMessage,
      nonServiceableMessage: rawSettings.nonServiceableMessage,
      supportEmail: rawSettings.supportEmail
    };

    res.json({
      success: true,
      settings: sanitizedSettings
    });
  } catch (error) {
    console.error('[getStoreSettings] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve store settings' });
  }
};

// @desc    Update store settings (Admin only)
// @route   PUT /api/settings
// @access  Admin only
export const updateStoreSettings = async (req, res) => {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = new StoreSettings();
    }

    const updatableFields = [
      'standardShippingFee',
      'freeShippingThreshold',
      'expressShippingFee',
      'codExtraFee',
      'estimatedDeliveryDays',
      'shippingNotice',
      'announcementActive',
      'announcementText',
      'topBannerOfferCode',
      'topBannerOfferText',
      'isOfferActive',
      'courierPartner',
      'shipperName',
      'shipperPhone',
      'shipperAddress',
      'shipperCity',
      'shipperState',
      'shipperPincode',
      'gstNumber',
      'fssaiNumber',
      'hubCode',
      'pincodeControlMode',
      'serviceableMessage',
      'nonServiceableMessage',
      'adminNotificationEmail',
      'orderAlertEmails',
      'supportEmail',
      'sendCustomerReceipt',
      'sendAdminOrderAlert'
    ];

    for (const field of updatableFields) {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    }

    // Handle serviceablePincodes formatting (array or comma/newline string)
    if (req.body.serviceablePincodes !== undefined) {
      if (Array.isArray(req.body.serviceablePincodes)) {
        settings.serviceablePincodes = req.body.serviceablePincodes.map(p => String(p).trim()).filter(Boolean);
      } else if (typeof req.body.serviceablePincodes === 'string') {
        settings.serviceablePincodes = req.body.serviceablePincodes
          .split(/[,\n\r\s]+/)
          .map(p => p.trim())
          .filter(p => p.length === 6 && /^\d+$/.test(p));
      }
    }

    // Handle serviceablePrefixes formatting
    if (req.body.serviceablePrefixes !== undefined) {
      if (Array.isArray(req.body.serviceablePrefixes)) {
        settings.serviceablePrefixes = req.body.serviceablePrefixes.map(p => String(p).trim()).filter(Boolean);
      } else if (typeof req.body.serviceablePrefixes === 'string') {
        settings.serviceablePrefixes = req.body.serviceablePrefixes
          .split(/[,\n\r\s]+/)
          .map(p => p.trim())
          .filter(Boolean);
      }
    }

    await settings.save();

    // Sync announcementText to HomepageContent if changed
    if (req.body.announcementText !== undefined || req.body.announcementActive !== undefined) {
      await HomepageContent.findOneAndUpdate(
        {},
        {
          ...(req.body.announcementText !== undefined && { announcementText: req.body.announcementText }),
          ...(req.body.announcementActive !== undefined && { announcementActive: req.body.announcementActive })
        }
      ).catch(() => null);
    }

    await logAudit(req, {
      action: 'STORE_SETTINGS_UPDATED',
      resourceType: 'StoreSettings',
      resourceId: settings._id,
      details: {
        standardShippingFee: settings.standardShippingFee,
        freeShippingThreshold: settings.freeShippingThreshold,
        courierPartner: settings.courierPartner,
        pincodeControlMode: settings.pincodeControlMode
      }
    });

    res.json({
      success: true,
      message: 'Store settings, pincode serviceability, and email preferences saved successfully',
      settings
    });
  } catch (error) {
    console.error('[updateStoreSettings] Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update store settings' });
  }
};

// @desc    Check whether a 6-digit pincode is serviceable
// @route   GET /api/settings/check-pincode/:pincode
export const checkPincodeServiceability = async (req, res) => {
  try {
    const { pincode } = req.params;
    const cleanPin = (pincode || '').replace(/\D/g, '').slice(0, 6);
    if (cleanPin.length !== 6) {
      return res.status(400).json({ success: false, message: 'Invalid 6-digit PIN code' });
    }

    const settings = await getOrCreateDefaultStoreSettings();
    let isServiceable = true;

    if (settings.pincodeControlMode === 'restricted') {
      const exactMatch = (settings.serviceablePincodes || []).includes(cleanPin);
      const prefixMatch = (settings.serviceablePrefixes || []).some(prefix => cleanPin.startsWith(prefix));
      isServiceable = exactMatch || prefixMatch;
    }

    res.json({
      success: true,
      pincode: cleanPin,
      isServiceable,
      message: isServiceable ? settings.serviceableMessage : settings.nonServiceableMessage,
      estimatedDays: settings.estimatedDeliveryDays || '3–5 Business Days',
      shippingFee: settings.standardShippingFee ?? 49,
      freeThreshold: settings.freeShippingThreshold ?? 499
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Dispatch test notification email from admin portal
// @route   POST /api/settings/test-email
// @access  Admin only
export const sendTestEmailController = async (req, res) => {
  try {
    const { targetEmail } = req.body;
    const settings = await getOrCreateDefaultStoreSettings();
    const recipient = targetEmail || settings.adminNotificationEmail || 'freelixir.b@gmail.com';

    const result = await sendTestEmail({ to: recipient, settings });
    res.json({
      success: true,
      message: `Test email notification successfully sent to ${recipient}`,
      recipient,
      result
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
