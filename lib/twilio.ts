import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;

if (!accountSid || !authToken || !verifySid) {
  throw new Error('Missing Twilio environment variables');
}

const client = twilio(accountSid, authToken);

export async function sendVerificationCode(phoneNumber: string) {
  try {
    const verification = await client.verify.v2
      .services(verifySid!)
      .verifications.create({
        to: phoneNumber,
        channel: 'sms',
      });
    return { success: true, sid: verification.sid };
  } catch (error) {
    console.error('Verification send error:', error);
    return { success: false, error: String(error) };
  }
}

export async function verifyCode(phoneNumber: string, code: string) {
  try {
    const verificationCheck = await client.verify.v2
      .services(verifySid!)
      .verificationChecks.create({
        to: phoneNumber,
        code: code,
      });
    return { success: verificationCheck.status === 'approved' };
  } catch (error) {
    console.error('Verification check error:', error);
    return { success: false };
  }
}
