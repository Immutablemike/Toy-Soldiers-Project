# Twilio KYC Verification Demo

This is a demonstration project showcasing **Twilio Verify API integration** for Know Your Customer (KYC) verification using **SvelteKit**, **Supabase**, and **Vercel**.

## Purpose

This demo is built to showcase compliant KYC verification workflows using Twilio, without exposing actual client implementations or sensitive business logic.

## Features

### Authentication Methods
- ✅ Email & Password
- ✅ OAuth (GitHub)
- ✅ Magic Link (Passwordless)
- ✅ Phone OTP (Supabase)
- ✅ **Phone KYC Verification (Twilio Verify)** ⭐

### Twilio KYC Integration
The project demonstrates:
- **Phone Verification Start**: Using Twilio Verify API to send SMS verification codes
- **Phone Verification Check**: Validating OTP codes against Twilio's service
- **Error Handling**: Comprehensive error handling for verification failures
- **User Feedback**: Clear messaging on verification status

## Tech Stack

- **Frontend**: Svelte 5 / SvelteKit 2
- **Backend**: Node.js (SvelteKit Server)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **KYC Verification**: Twilio Verify API
- **Hosting**: Vercel

## Setup Instructions

### Prerequisites
- Node.js 18+
- Supabase account
- Twilio account with Verify service enabled
- Vercel account (for deployment)
- GitHub account (for repository)

### 1. Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
# Supabase
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SECRET_KEY=your_secret_key

# Twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid
```

### 2. Supabase Setup

1. Create a new Supabase project
2. Note your project URL and keys
3. Enable Auth providers as needed (Email, GitHub, Phone)

### 3. Twilio Setup

1. Sign up at [twilio.com](https://www.twilio.com)
2. Navigate to Verify > Services
3. Create a new Verify Service
4. Copy the Service SID
5. Get your Account SID and Auth Token from the console

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Locally

```bash
npm run dev
```

Visit `http://localhost:5173` and navigate to `/auth` to see the KYC verification flow.

## 🌐 Live Demo

**Production URL:** https://toy-soldiers-project-6vkmo0jzz-immutablemikes-projects.vercel.app

### 6. Build for Production

```bash
npm run build
npm run preview
```

## Deployment to Vercel

### Using Vercel CLI

```bash
npm install -g vercel
vercel
```

### Using GitHub Integration

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SECRET_KEY`
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_VERIFY_SERVICE_SID`

4. Deploy automatically on push

## Project Structure

```
src/
├── lib/
│   ├── server/
│   │   ├── event.ts          # Form data utilities
│   │   └── twilio.ts         # Twilio Verify integration ⭐
│   └── utils.ts
├── routes/
│   ├── auth/
│   │   ├── +page.svelte      # Auth UI with KYC form
│   │   └── +page.server.ts   # Auth & KYC actions
│   ├── (authenticated)/
│   │   └── app/              # Protected routes
│   └── ...
└── hooks.server.ts
```

## KYC Verification Flow

### Step 1: User enters phone number
- User submits phone number (must be E.164 format: +1234567890)
- `kyc_verify_phone` action triggers

### Step 2: Twilio sends SMS
- `startPhoneVerification()` calls Twilio Verify API
- SMS with 6-digit code sent to user's phone
- User sees confirmation message

### Step 3: User enters OTP
- User submits 6-digit code from SMS
- `kyc_confirm_phone` action triggers

### Step 4: Verification check
- `verifyPhoneNumber()` validates code with Twilio
- Success: User sees confirmation message
- Failure: User can retry

## API Integration

### Twilio Verify

**Start Verification:**
```typescript
const verification = await client.verify.v2
  .services(verifyServiceSid)
  .verifications
  .create({ to: phoneNumber, channel: 'sms' })
```

**Check Verification:**
```typescript
const verificationCheck = await client.verify.v2
  .services(verifyServiceSid)
  .verificationChecks
  .create({ to: phoneNumber, code })
```

### Supabase Auth

- Email/Password signup & signin
- OAuth with GitHub
- Magic link authentication
- Phone OTP (Supabase's built-in service)

## Testing

### Test Phone Numbers

For testing without real SMS, use Twilio's test credentials:
- Use phone number format: `+15005550006` (US)
- OTP code will always be: `123456`

### Local Testing

1. Create test user with email
2. Navigate to KYC verification section
3. Enter phone number (real or test format)
4. Enter OTP when prompted
5. See success message

## Security Considerations

- ✅ All Twilio operations happen on server-side only
- ✅ API credentials stored in environment variables
- ✅ No sensitive data exposed to client
- ✅ HTTPS enforced in production
- ✅ Supabase handles user authentication securely
- ✅ Twilio API tokens never exposed

## Monitoring & Logging

- Twilio API errors logged on server
- Form submission errors displayed to user
- Verification status tracked

## Support & Documentation

- [Twilio Verify Docs](https://www.twilio.com/docs/verify)
- [SvelteKit Docs](https://kit.svelte.dev)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)

## License

This demo project is provided as-is for demonstration purposes.

---

**Built with ❤️ for KYC compliance demonstration**
