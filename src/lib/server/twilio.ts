import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID

if (!accountSid || !authToken || !verifyServiceSid) {
  throw new Error('Missing Twilio environment variables')
}

const client = twilio(accountSid, authToken as string)
const serviceSid = verifyServiceSid as string

export const twilioClient = client

/**
 * Start phone number verification via SMS
 * @param phoneNumber - Phone number in E.164 format (e.g., +1234567890)
 * @returns Promise with verification SID
 */
export async function startPhoneVerification(phoneNumber: string) {
  try {
    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications
      .create({ to: phoneNumber, channel: 'sms' })
    
    return {
      success: true,
      verificationSid: verification.sid,
      status: verification.status
    }
  } catch (error) {
    console.error('Twilio verification start error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to start verification'
    }
  }
}

/**
 * Verify phone number with OTP code
 * @param phoneNumber - Phone number in E.164 format
 * @param code - 6-digit OTP code
 * @returns Promise with verification result
 */
export async function verifyPhoneNumber(phoneNumber: string, code: string) {
  try {
    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks
      .create({ to: phoneNumber, code })
    
    return {
      success: verificationCheck.status === 'approved',
      status: verificationCheck.status,
      valid: verificationCheck.valid
    }
  } catch (error) {
    console.error('Twilio verification check error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify code'
    }
  }
}

export default client
