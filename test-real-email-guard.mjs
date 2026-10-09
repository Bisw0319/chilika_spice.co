const BASE_URL = 'http://127.0.0.1:5000/api';
const REAL_EMAIL = 'freelixir.b@gmail.com';
const FAKE_EMAIL = 'fake_user_test99812@fakedatasite.xyz';

async function runTests() {
  console.log('==============================================================');
  console.log('  TESTING CHILIKA SPICES FAKE EMAIL DEFENSE & OTP MANDATE     ');
  console.log('==============================================================\n');

  try {
    // 1. Attempting to register with fake email without OTP (MUST FAIL)
    console.log('[1/5] Testing Registration with fake email and NO OTP (should be blocked)...');
    const fakeRegisterRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Fake Account',
        email: FAKE_EMAIL,
        password: 'Password@123'
      })
    });
    const fakeRegisterData = await fakeRegisterRes.json();
    console.log('Response status:', fakeRegisterRes.status, '| Message:', fakeRegisterData.message);
    if (fakeRegisterRes.status !== 400 || !fakeRegisterData.message.includes('verification code')) {
      throw new Error('Fake registration without OTP was not blocked!');
    }
    console.log('✔ Blocked! Fake emails cannot register without OTP.\n');

    // 2. Attempting to register with fake OTP (MUST FAIL)
    console.log('[2/5] Testing Registration with random fake OTP 000000 (should be blocked)...');
    const badOtpRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Fake Account',
        email: FAKE_EMAIL,
        password: 'Password@123',
        otp: '000000'
      })
    });
    const badOtpData = await badOtpRes.json();
    console.log('Response status:', badOtpRes.status, '| Message:', badOtpData.message);
    if (badOtpRes.status !== 400) {
      throw new Error('Registration with fake OTP was not blocked!');
    }
    console.log('✔ Blocked! Fake OTP was rejected.\n');

    // 3. Request real OTP for freelixir.b@gmail.com
    console.log('[3/5] Requesting real verification OTP for:', REAL_EMAIL);
    const sendOtpRes = await fetch(`${BASE_URL}/auth/send-verification-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: REAL_EMAIL })
    });
    const sendOtpData = await sendOtpRes.json();
    console.log('Response:', sendOtpData);
    if (!sendOtpData.success) {
      throw new Error('Failed to send OTP to real email');
    }
    console.log('✔ Live email dispatched to mailbox via Gmail!\n');

    // 4. Test Forgot Password on non-existent account (MUST FAIL)
    console.log('[4/5] Testing Forgot Password on non-existent account (should return 404)...');
    const forgotFakeRes = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nonexistent@randomdomain.com' })
    });
    const forgotFakeData = await forgotFakeRes.json();
    console.log('Response status:', forgotFakeRes.status, '| Message:', forgotFakeData.message);
    if (forgotFakeRes.status !== 404) {
      throw new Error('Forgot password for non-existent account did not return 404!');
    }
    console.log('✔ Blocked! Unregistered emails cannot trigger password resets.\n');

    console.log('==============================================================');
    console.log('  ALL FAKE EMAIL PREVENTION & OTP DEFENSE TESTS PASSED!       ');
    console.log('==============================================================');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

runTests();
