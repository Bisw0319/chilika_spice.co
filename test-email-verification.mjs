const BASE_URL = 'http://127.0.0.1:5000/api';
const TEST_EMAIL = 'freelixir.b@gmail.com';

async function runTests() {
  console.log('========================================================');
  console.log('  TESTING CHILIKA SPICES EMAIL VERIFICATION & OTP SYSTEM');
  console.log('  Target Test Email:', TEST_EMAIL);
  console.log('========================================================\n');

  try {
    // 1. Send Verification OTP to freelixir.b@gmail.com
    console.log('[1/5] Dispatching verification OTP to:', TEST_EMAIL);
    const sendOtpRes = await fetch(`${BASE_URL}/auth/send-verification-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TEST_EMAIL })
    });
    const sendOtpData = await sendOtpRes.json();
    console.log('Response:', sendOtpData);
    if (!sendOtpData.success || !sendOtpData.devOtp) {
      throw new Error('Failed to generate verification OTP');
    }
    const verificationOtp = sendOtpData.devOtp;
    console.log('✔ Verification OTP generated successfully:', verificationOtp, '\n');

    // 2. Verify Email OTP
    console.log('[2/5] Submitting OTP verification for:', TEST_EMAIL);
    const verifyRes = await fetch(`${BASE_URL}/auth/verify-email-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TEST_EMAIL, otp: verificationOtp })
    });
    const verifyData = await verifyRes.json();
    console.log('Response:', verifyData);
    if (!verifyData.success) {
      throw new Error('Failed to verify OTP');
    }
    console.log('✔ Email verified successfully!\n');

    // 3. Register Customer with verified email
    console.log('[3/5] Registering new customer with verified email...');
    const registerRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Freelixir User',
        email: TEST_EMAIL,
        password: 'Password@123',
        phone: '9876543210'
      })
    });
    const registerData = await registerRes.json();
    console.log('Response:', registerData);
    if (!registerData.success || !registerData.user.isEmailVerified) {
      throw new Error('Customer registration failed or isEmailVerified is false');
    }
    console.log('✔ Customer registered with isEmailVerified: true\n');

    // 4. Test Forgot Password - Send Reset OTP
    console.log('[4/5] Testing Forgot Password OTP request for:', TEST_EMAIL);
    const forgotRes = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TEST_EMAIL })
    });
    const forgotData = await forgotRes.json();
    console.log('Response:', forgotData);
    if (!forgotData.success || !forgotData.devOtp) {
      throw new Error('Failed to send forgot password OTP');
    }
    const resetOtp = forgotData.devOtp;
    console.log('✔ Forgot password OTP generated:', resetOtp, '\n');

    // 5. Test Reset Password with OTP & new password
    console.log('[5/5] Resetting password with OTP code...');
    const NEW_PASSWORD = 'NewChilikaPass@2026';
    const resetRes = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_EMAIL,
        otp: resetOtp,
        newPassword: NEW_PASSWORD
      })
    });
    const resetData = await resetRes.json();
    console.log('Response:', resetData);
    if (!resetData.success) {
      throw new Error('Failed to reset password');
    }
    console.log('✔ Password reset successful!\n');

    // Bonus: Verify login with the new password
    console.log('[Bonus] Verifying customer login with new password...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: NEW_PASSWORD
      })
    });
    const loginData = await loginRes.json();
    console.log('Response:', loginData);
    if (!loginData.success || !loginData.token) {
      throw new Error('Login with new password failed');
    }
    console.log('✔ Login authorized with newly reset password!\n');

    console.log('========================================================');
    console.log('  ALL EMAIL VERIFICATION & FORGOT PASSWORD TESTS PASSED! ');
    console.log('========================================================');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

runTests();
