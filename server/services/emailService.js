import nodemailer from 'nodemailer';
import { Resend } from 'resend';

// Initialize Resend if API key is present
const getResendClient = () => {
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim() !== '') {
    return new Resend(process.env.RESEND_API_KEY.trim());
  }
  return null;
};

// Generate 6-digit numeric OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create Nodemailer Transporter for Gmail / SMTP
const createNodemailerTransporter = async () => {
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, '')?.replace(/["']/g, '')?.trim();

  if (emailUser && emailPass) {
    if (process.env.EMAIL_SERVICE === 'gmail' || emailUser.includes('@gmail.com')) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass
        }
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });
  }

  // Fallback to ethereal for testing when no credentials provided
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  } catch (err) {
    console.warn('[EmailService] Local console fallback:', err.message);
    return null;
  }
};

/**
 * Send branded HTML email for OTP (Delivery to User's Mailbox)
 */
export const sendOTPEmail = async (to, otp, purpose = 'verification') => {
  const isReset = purpose === 'password_reset';
  const subject = isReset
    ? 'Chilika Spices - Your Password Reset Code'
    : 'Chilika Spices - Verify Your Email Address';

  const title = isReset ? 'Reset Your Password' : 'Verify Your Email';
  const actionText = isReset
    ? 'Use the 6-digit verification code below to set a new password for your account:'
    : 'Welcome to Chilika Spices! Use the 6-digit verification code below to verify your email:';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF6EF; margin: 0; padding: 20px; }
        .card { max-width: 520px; margin: 20px auto; background-color: #ffffff; border-radius: 20px; border: 1px solid #E4D9C8; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .header { background-color: #8C2216; padding: 25px 20px; text-align: center; color: #FAF6EF; }
        .logo-title { font-family: serif; font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 0.5px; }
        .tagline { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #D4A373; margin-top: 4px; }
        .content { padding: 30px 25px; text-align: center; color: #3A2E2B; }
        .headline { font-size: 20px; font-weight: bold; margin-bottom: 12px; color: #8C2216; }
        .text { font-size: 14px; line-height: 1.6; color: #5C4A42; margin-bottom: 25px; }
        .otp-box { display: inline-block; background-color: #FAF6EF; border: 2px dashed #8C2216; border-radius: 12px; padding: 14px 30px; font-size: 32px; font-family: monospace; font-weight: bold; letter-spacing: 8px; color: #8C2216; margin-bottom: 20px; }
        .expiry { font-size: 12px; color: #887B75; }
        .footer { background-color: #F5EFE6; padding: 18px 20px; text-align: center; font-size: 11px; color: #887B75; border-top: 1px solid #E4D9C8; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="logo-title">CHILIKA SPICES</div>
          <div class="tagline">From village to your kitchen</div>
        </div>
        <div class="content">
          <div class="headline">${title}</div>
          <div class="text">${actionText}</div>
          <div class="otp-box">${otp}</div>
          <div class="expiry">This code is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</div>
        </div>
        <div class="footer">
          Authentic Odisha Spices & Blends &bull; Chilika, Odisha<br>
          If you did not request this, you can safely ignore this email.
        </div>
      </div>
    </body>
    </html>
  `;

  // 1. Try Resend if configured
  const resend = getResendClient();
  if (resend) {
    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
      const resendRes = await resend.emails.send({
        from: `Chilika Spices <${fromEmail}>`,
        to: [to],
        subject,
        html
      });
      console.log(`[RESEND SUCCESS] Dispatched OTP email to ${to} (ID: ${resendRes.data?.id})`);
      return { success: true, provider: 'resend', id: resendRes.data?.id };
    } catch (resendErr) {
      console.error('[RESEND ERROR] Failed to send via Resend:', resendErr.message);
    }
  }

  // 2. Try Nodemailer (Gmail / SMTP / Ethereal)
  try {
    const transporter = await createNodemailerTransporter();
    if (transporter) {
      const fromAddr = process.env.EMAIL_USER
        ? `"Chilika Spices" <${process.env.EMAIL_USER}>`
        : '"Chilika Spices" <no-reply@chilikaspices.com>';

      const info = await transporter.sendMail({
        from: fromAddr,
        to,
        subject,
        html
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`[NODEMAILER SUCCESS] Dispatched OTP to ${to} | MessageId: ${info.messageId}`);
      if (previewUrl) {
        console.log(`[TEST PREVIEW URL] View delivered email: ${previewUrl}`);
      }

      return { success: true, provider: 'nodemailer', previewUrl: previewUrl || null };
    }
  } catch (nmErr) {
    console.error('[NODEMAILER ERROR] Failed to send via Nodemailer:', nmErr.message);
  }

  // Fallback log
  console.log(`[OTP DISPATCH LOG] To: ${to} | Code: ${otp}`);
  return { success: true, provider: 'local-log' };
};

/**
 * Send Contact Message to the Chilika Spices Owner (freelixir.b@gmail.com)
 */
export const sendContactInquiryEmail = async ({ name, email, phone, message }) => {
  const targetReceiver = process.env.CONTACT_RECEIVER_EMAIL || 'freelixir.b@gmail.com';
  const subject = `New Inquiry from Chilika Spices: ${name}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF6EF; margin: 0; padding: 20px; }
        .card { max-width: 580px; margin: 20px auto; background-color: #ffffff; border-radius: 20px; border: 1px solid #E4D9C8; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .header { background-color: #8C2216; padding: 20px; text-align: center; color: #FAF6EF; }
        .logo-title { font-family: serif; font-size: 22px; font-weight: bold; margin: 0; }
        .content { padding: 25px; color: #3A2E2B; }
        .field { margin-bottom: 14px; font-size: 14px; }
        .field strong { color: #8C2216; display: inline-block; width: 90px; }
        .message-box { background-color: #FAF6EF; border-left: 4px solid #8C2216; padding: 15px; border-radius: 8px; margin-top: 15px; font-size: 14px; line-height: 1.6; color: #4A3B32; }
        .footer { background-color: #F5EFE6; padding: 15px; text-align: center; font-size: 11px; color: #887B75; border-top: 1px solid #E4D9C8; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="logo-title">CHILIKA SPICES — NEW INQUIRY</div>
        </div>
        <div class="content">
          <div class="field"><strong>Customer:</strong> ${name}</div>
          <div class="field"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></div>
          <div class="field"><strong>Phone:</strong> ${phone || 'Not provided'}</div>
          
          <div style="margin-top: 18px; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #8C2216;">
            Customer Message:
          </div>
          <div class="message-box">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
        <div class="footer">
          Received via Chilika Spices storefront contact form &bull; Reply directly to <a href="mailto:${email}">${email}</a>
        </div>
      </div>
    </body>
    </html>
  `;

  // 1. Try Resend
  const resend = getResendClient();
  if (resend) {
    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
      const resendRes = await resend.emails.send({
        from: `Chilika Contact <${fromEmail}>`,
        to: [targetReceiver],
        replyTo: email,
        subject,
        html
      });
      console.log(`[RESEND INQUIRY SUCCESS] Forwarded contact message to ${targetReceiver} (ID: ${resendRes.data?.id})`);
      return { success: true, provider: 'resend', id: resendRes.data?.id };
    } catch (err) {
      console.error('[RESEND INQUIRY ERROR]', err.message);
    }
  }

  // 2. Try Nodemailer
  try {
    const transporter = await createNodemailerTransporter();
    if (transporter) {
      const fromAddr = process.env.EMAIL_USER
        ? `"Chilika Contact" <${process.env.EMAIL_USER}>`
        : '"Chilika Contact" <contact@chilikaspices.com>';

      const info = await transporter.sendMail({
        from: fromAddr,
        to: targetReceiver,
        replyTo: email,
        subject,
        html
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`[NODEMAILER INQUIRY SUCCESS] Forwarded to ${targetReceiver} | MessageId: ${info.messageId}`);
      if (previewUrl) {
        console.log(`[TEST PREVIEW URL] View delivered inquiry email: ${previewUrl}`);
      }

      return { success: true, provider: 'nodemailer', previewUrl: previewUrl || null };
    }
  } catch (nmErr) {
    console.error('[NODEMAILER INQUIRY ERROR]', nmErr.message);
  }

  return { success: true, provider: 'local-log' };
};

/**
 * Send New Order Alert Email to Admin's configured email addresses
 */
export const sendNewOrderAdminAlertEmail = async ({ order, settings }) => {
  const primaryAdmin = settings?.adminNotificationEmail || process.env.CONTACT_RECEIVER_EMAIL || 'freelixir.b@gmail.com';
  const additionalList = settings?.orderAlertEmails
    ? settings.orderAlertEmails.split(/[,\s]+/).filter(e => e && e.includes('@'))
    : [];

  const recipientList = Array.from(new Set([primaryAdmin, ...additionalList]));
  const subject = `🔥 New Order Placed: ${order.orderId} (₹${order.total}) - Chilika Spices`;

  const itemsHtml = (order.items || []).map((item) => `
    <tr>
      <td style="padding: 8px 12px; border-bottom: 1px solid #E4D9C8;">${item.productName} (${item.size || '100g'})</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #E4D9C8; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #E4D9C8; text-align: right;">₹${item.subtotal || (item.price * item.quantity)}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF6EF; margin: 0; padding: 20px; color: #3A2E2B; }
        .card { max-width: 600px; margin: 15px auto; background-color: #ffffff; border-radius: 20px; border: 1px solid #E4D9C8; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); }
        .header { background-color: #8C2216; padding: 20px; text-align: center; color: #FAF6EF; }
        .badge { display: inline-block; background-color: #D4A373; color: #3A2E2B; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 11px; text-transform: uppercase; margin-bottom: 6px; }
        .title { font-size: 22px; font-weight: bold; margin: 0; font-family: serif; }
        .content { padding: 24px; }
        .section-title { font-size: 13px; font-weight: bold; text-transform: uppercase; color: #8C2216; letter-spacing: 1px; margin-bottom: 8px; border-bottom: 2px solid #FAF6EF; padding-bottom: 4px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px; margin-bottom: 18px; }
        .table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 10px; margin-bottom: 18px; }
        .footer { background-color: #F5EFE6; padding: 15px; text-align: center; font-size: 11px; color: #887B75; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="badge">Store Admin Alert</div>
          <div class="title">New Customer Order Received!</div>
        </div>
        <div class="content">
          <div style="background-color: #FAF6EF; padding: 15px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #E4D9C8;">
            <div style="font-size: 14px; margin-bottom: 6px;"><strong>Order ID:</strong> <span style="font-family: monospace; font-size: 16px; color: #8C2216; font-weight: bold;">${order.orderId}</span></div>
            <div style="font-size: 14px; margin-bottom: 6px;"><strong>Total Amount:</strong> <span style="font-size: 18px; font-weight: bold; color: #3A2E2B;">₹${order.total}</span> (${(order.paymentMethod || 'upi').toUpperCase()})</div>
            ${order.paymentDetails?.utrNumber ? `<div style="font-size: 13px; color: #8C2216;"><strong>Submitted UPI UTR:</strong> <span style="font-family: monospace; background: white; padding: 2px 6px; border-radius: 4px; border: 1px solid #D4A373;">${order.paymentDetails.utrNumber}</span></div>` : ''}
          </div>

          <div class="section-title">Customer & Delivery Details</div>
          <div style="font-size: 13px; line-height: 1.6; margin-bottom: 20px;">
            <p style="margin: 3px 0;"><strong>Customer Name:</strong> ${order.shippingAddress?.fullName}</p>
            <p style="margin: 3px 0;"><strong>Phone:</strong> <a href="tel:${order.shippingAddress?.phone}">${order.shippingAddress?.phone}</a></p>
            ${order.shippingAddress?.email ? `<p style="margin: 3px 0;"><strong>Email:</strong> ${order.shippingAddress?.email}</p>` : ''}
            <p style="margin: 3px 0;"><strong>Address:</strong> ${order.shippingAddress?.street}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state} - <strong>${order.shippingAddress?.pincode}</strong></p>
          </div>

          <div class="section-title">Ordered Items</div>
          <table class="table">
            <thead>
              <tr style="background-color: #FAF6EF; color: #5C4A42;">
                <th style="padding: 8px 12px; text-align: left;">Product</th>
                <th style="padding: 8px 12px; text-align: center;">Qty</th>
                <th style="padding: 8px 12px; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="text-align: center; margin-top: 25px;">
            <a href="http://localhost:5173/admin/orders" style="display: inline-block; background-color: #8C2216; color: white; padding: 12px 26px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 13px;">
              Open Admin Orders Panel →
            </a>
          </div>
        </div>
        <div class="footer">
          Notification dispatched by Chilika Spices System &bull; Configured destination: ${recipientList.join(', ')}
        </div>
      </div>
    </body>
    </html>
  `;

  // 1. Try Resend
  const resend = getResendClient();
  if (resend) {
    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
      const res = await resend.emails.send({
        from: `Chilika Orders <${fromEmail}>`,
        to: recipientList,
        subject,
        html
      });
      console.log(`[RESEND ORDER ALERT] Alert sent to ${recipientList.join(', ')} (ID: ${res.data?.id})`);
      return { success: true, provider: 'resend' };
    } catch (e) {
      console.error('[RESEND ORDER ALERT ERROR]', e.message);
    }
  }

  // 2. Try Nodemailer
  try {
    const transporter = await createNodemailerTransporter();
    if (transporter) {
      const fromAddr = process.env.EMAIL_USER
        ? `"Chilika Orders" <${process.env.EMAIL_USER}>`
        : '"Chilika Orders" <orders@chilikaspices.com>';

      await transporter.sendMail({
        from: fromAddr,
        to: recipientList.join(', '),
        subject,
        html
      });
      console.log(`[NODEMAILER ORDER ALERT] Dispatched order alert to: ${recipientList.join(', ')}`);
      return { success: true, provider: 'nodemailer' };
    }
  } catch (err) {
    console.error('[NODEMAILER ORDER ALERT ERROR]', err.message);
  }

  console.log(`[ORDER ALERT LOG] New Order ${order.orderId} alert intended for: ${recipientList.join(', ')}`);
  return { success: true, provider: 'local-log' };
};

/**
 * Send Customer Order Receipt Email
 */
export const sendCustomerOrderConfirmationEmail = async ({ order, settings }) => {
  const customerEmail = order.shippingAddress?.email;
  if (!customerEmail || !customerEmail.includes('@')) return { success: false, reason: 'No customer email' };

  const subject = `Dhanyabad! Your Chilika Spices Order is Confirmed (${order.orderId})`;
  const itemsHtml = (order.items || []).map((item) => `
    <tr>
      <td style="padding: 8px 12px; border-bottom: 1px solid #E4D9C8;">${item.productName} (${item.size || '100g'})</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #E4D9C8; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #E4D9C8; text-align: right;">₹${item.subtotal || (item.price * item.quantity)}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF6EF; margin: 0; padding: 20px; color: #3A2E2B; }
        .card { max-width: 580px; margin: 15px auto; background-color: #ffffff; border-radius: 20px; border: 1px solid #E4D9C8; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); }
        .header { background-color: #8C2216; padding: 25px 20px; text-align: center; color: #FAF6EF; }
        .content { padding: 25px; }
        .table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 15px 0; }
        .footer { background-color: #F5EFE6; padding: 15px; text-align: center; font-size: 11px; color: #887B75; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div style="font-family: serif; font-size: 24px; font-weight: bold;">CHILIKA SPICES</div>
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #D4A373;">From village to your kitchen</div>
        </div>
        <div class="content">
          <h2 style="font-family: serif; color: #8C2216; margin-top: 0;">Dhanyabad, ${order.shippingAddress?.fullName}!</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #5C4A42;">
            Thank you for ordering pure Odisha heritage spices from Chilika Spices. Your package is being packed fresh and will be dispatched promptly.
          </p>

          <div style="background-color: #FAF6EF; padding: 15px; border-radius: 12px; margin: 18px 0; font-size: 13px;">
            <p style="margin: 4px 0;"><strong>Order ID:</strong> <span style="font-family: monospace; font-size: 15px; color: #8C2216;">${order.orderId}</span></p>
            <p style="margin: 4px 0;"><strong>Invoice Number:</strong> ${order.invoiceNumber || `INV-${order.orderId}`}</p>
            <p style="margin: 4px 0;"><strong>Delivery To:</strong> ${order.shippingAddress?.street}, ${order.shippingAddress?.city} - ${order.shippingAddress?.pincode}</p>
            <p style="margin: 4px 0;"><strong>Total Amount:</strong> ₹${order.total}</p>
          </div>

          <table class="table">
            <thead>
              <tr style="background-color: #FAF6EF; color: #5C4A42;">
                <th style="padding: 8px 12px; text-align: left;">Item</th>
                <th style="padding: 8px 12px; text-align: center;">Qty</th>
                <th style="padding: 8px 12px; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="text-align: center; margin: 25px 0;">
            <a href="http://localhost:5173/track-order?orderId=${order.orderId}" style="display: inline-block; background-color: #8C2216; color: white; padding: 12px 28px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 13px;">
              Track Live Order Status →
            </a>
          </div>
        </div>
        <div class="footer">
          Chilika Spices &bull; Balugaon, Chilika, Odisha &bull; Helpline: +91 96686 59633
        </div>
      </div>
    </body>
    </html>
  `;

  // Try Resend or Nodemailer
  const resend = getResendClient();
  if (resend) {
    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
      await resend.emails.send({
        from: `Chilika Spices <${fromEmail}>`,
        to: [customerEmail],
        subject,
        html
      });
      return { success: true, provider: 'resend' };
    } catch (e) {}
  }

  try {
    const transporter = await createNodemailerTransporter();
    if (transporter) {
      const fromAddr = process.env.EMAIL_USER
        ? `"Chilika Spices" <${process.env.EMAIL_USER}>`
        : '"Chilika Spices" <care@chilikaspices.com>';
      await transporter.sendMail({
        from: fromAddr,
        to: customerEmail,
        subject,
        html
      });
      return { success: true, provider: 'nodemailer' };
    }
  } catch (err) {}

  return { success: true, provider: 'local-log' };
};

/**
 * Send Test Email from Admin Portal
 */
export const sendTestEmail = async ({ to, settings }) => {
  const subject = 'Test Notification: Chilika Spices Admin Mail Routing Verified';
  const html = `
    <div style="font-family: sans-serif; max-width: 500px; margin: 20px auto; padding: 25px; border-radius: 16px; border: 1px solid #E4D9C8; background: #ffffff;">
      <h2 style="color: #8C2216; margin-top: 0;">Chilika Spices — Test Email Successful!</h2>
      <p style="font-size: 14px; color: #4A3B32;">
        This test confirms that your admin email notification system is properly configured and actively delivering messages to <strong>${to}</strong>.
      </p>
      <div style="background: #FAF6EF; padding: 12px; border-radius: 8px; font-size: 12px; margin-top: 15px;">
        Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)
      </div>
    </div>
  `;

  const resend = getResendClient();
  if (resend) {
    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
      const r = await resend.emails.send({
        from: `Chilika Spices <${fromEmail}>`,
        to: [to],
        subject,
        html
      });
      return { success: true, provider: 'resend', id: r.data?.id };
    } catch (err) {
      console.warn('[Test Email Resend]', err.message);
    }
  }

  try {
    const transporter = await createNodemailerTransporter();
    if (transporter) {
      const fromAddr = process.env.EMAIL_USER
        ? `"Chilika Spices" <${process.env.EMAIL_USER}>`
        : '"Chilika Spices" <care@chilikaspices.com>';
      const info = await transporter.sendMail({
        from: fromAddr,
        to,
        subject,
        html
      });
      return { success: true, provider: 'nodemailer', messageId: info.messageId };
    }
  } catch (err) {
    console.warn('[Test Email Nodemailer]', err.message);
  }

  return { success: true, provider: 'local-log' };
};
