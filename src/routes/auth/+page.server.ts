import { fail, redirect } from '@sveltejs/kit'
import { type Provider } from '@supabase/supabase-js'
import { getFormData } from '$lib/server/event.js'
import { startPhoneVerification, verifyPhoneNumber } from '$lib/server/twilio.js'

export const load = async ({ locals: { getSession } }) => {
  const session = await getSession()

  /* User is already logged in. */
  if (session) redirect(303, '/app')
}

export const actions = {
  signup: async ({ locals: { supabase } }) => {
    const { email, password } = await getFormData('email', 'password')

    if (!email || !password)
      return fail(400,
        { error: 'Please enter an email and password', email }
      )

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error)
      return fail(error.status ?? 400, { error: error.message, email })
    else
      return { message: 'Please check your email to confirm your signup.' }
  },
  signin_email: async ({ locals: { supabase } }) => {
    const { email, password } = await getFormData('email', 'password')

    if (!email || !password)
      return fail(400,
        { error: 'Please enter an email and password', email }
      )
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
  
    if (error)
      return fail(error.status ?? 400, { error: error.message, email })

    /* Login successful, redirect. */
    redirect(303, '/app')
  },
  signin_otp: async ({ locals: { supabase }}) => {
    const { phone } = await getFormData('phone')

    if (!phone) {
      return fail(400,
        { error: 'Please enter a phone number.' }
      )
    }

    const { error } = await supabase.auth.signInWithOtp({
      phone,
    })

    if (error)
      return fail(error.status ?? 400, { error: error.message, phone })

    return { message: 'Please check your phone for the OTP code and enter it below.' , verify: true, phone }

  },
  oauth: async ({ url, locals: { supabase }}) => {
    const { provider } = await getFormData<Provider>('provider')

    if (!provider)
      return fail(400, { error: 'No provider found.'})

    /**
     * Sign-in will not happen yet, because we're on the server-side, 
     * but we need the returned url.
     */
    const { data, error } = await supabase.auth.signInWithOAuth({ 
      provider,
      options: {
        redirectTo: `${url.origin}/auth/callback?next=/app`
      }
    })

    if (error)
      return fail(error.status ?? 400, { error: error.message })

    /* Now authorize sign-in on browser. */
    if (data.url) redirect(303, data.url)
  },
  magic: async ({ locals: { supabase }}) => {
    const { email } = await getFormData('email')

    if (!email)
      return fail(400, { error: 'Please enter an email.' })

    const { error } = await supabase.auth.signInWithOtp({
      email
    })

    if (error)
      return fail(error.status ?? 400, { error: error.message })
    else
      return { message: 'Please check your email to login.' }
  },
  anon: async ({ locals: { supabase }}) => {
    const { error } = await supabase.auth.signInAnonymously()

    if (error)
      return fail(error.status ?? 400, { error: error.message })

    /* Login successful, redirect. */
    redirect(303, '/app')
  },
  reset: async({ locals: { supabase } }) => {
    const { email } = await getFormData('email')

    if (!email)
      return fail(400, { error: 'Please enter an email.' })

    const { error } = await supabase.auth.resetPasswordForEmail(email)

    if (error)
      return fail(error.status ?? 400, { error: error.message })
    else
      return { message: 'Please check your email to reset your password.' }
  },
  signout: async ({ locals: { supabase } }) => {
    await supabase.auth.signOut()
    redirect(303, '/')
  },
  verify_otp: async ({ locals: { supabase } }) => {
    const { otp, phone } = await getFormData('otp', 'phone')

    if (!otp) {
      return fail(400,
        { error: 'Please enter an OTP.', verify: true, phone }
      )
    }

    if (!phone) {
      return fail(400,
        { error: 'No phone number found.', verify: true }
      )
    }

    const { error } = await supabase.auth.verifyOtp({
      phone,
      type: 'sms',
      token: otp,
      options: { redirectTo: 'http://localhost:5173/app' }
    })

    if (error)
      return fail(error.status ?? 400, { error: error.message, verify: true, phone })
  },
  kyc_verify_phone: async () => {
    const { phone } = await getFormData('phone')

    if (!phone) {
      return fail(400, { error: 'Please enter a phone number.' })
    }

    const result = await startPhoneVerification(phone)

    if (!result.success) {
      return fail(400, {
        error: result.error || 'Failed to start phone verification',
        phone
      })
    }

    return {
      message: `Verification code sent to ${phone}. Please check your SMS.`,
      verify_kyc: true,
      phone
    }
  },
  kyc_confirm_phone: async () => {
    const { phone, code } = await getFormData('phone', 'code')

    if (!phone || !code) {
      return fail(400, {
        error: 'Phone number and verification code are required.',
        verify_kyc: true,
        phone
      })
    }

    const result = await verifyPhoneNumber(phone, code)

    if (!result.success) {
      return fail(400, {
        error: result.error || 'Verification failed. Please try again.',
        verify_kyc: true,
        phone
      })
    }

    return {
      message: `✅ Phone number ${phone} verified successfully! Your KYC verification is complete.`,
      verify_kyc: false
    }
  }
}
