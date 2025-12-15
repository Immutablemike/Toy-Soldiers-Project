import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Supabase client
const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Twilio client (lazy init to prevent build errors)
let twilioClient;
function getTwilioClient() {
  if (!twilioClient && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return twilioClient;
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SUPABASE_SECRET_KEY || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 }
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Auth middleware
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth');
  }
  next();
}

// Routes
app.get('/', (req, res) => {
  res.render('index', { user: req.session.user || null });
});

app.get('/auth', (req, res) => {
  if (req.session.user) {
    return res.redirect('/app');
  }
  res.render('auth', { error: null });
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    req.session.user = data.user;
    res.redirect('/app');
  } catch (error) {
    res.render('auth', { error: error.message });
  }
});

app.post('/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;

    req.session.user = data.user;
    res.redirect('/app');
  } catch (error) {
    res.render('auth', { error: error.message });
  }
});

app.get('/auth/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/app', requireAuth, (req, res) => {
  res.render('app', { user: req.session.user });
});

app.get('/self', requireAuth, (req, res) => {
  res.render('self', { user: req.session.user, verification: null, error: null });
});

// Phone verification routes
app.post('/api/verify/send', requireAuth, async (req, res) => {
  const { phoneNumber } = req.body;
  
  try {
    const client = getTwilioClient();
    if (!client) {
      throw new Error('Twilio not configured');
    }

    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications
      .create({ to: phoneNumber, channel: 'sms' });

    res.json({ success: true, status: verification.status });
  } catch (error) {
    console.error('Twilio send error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/verify/check', requireAuth, async (req, res) => {
  const { phoneNumber, code } = req.body;
  
  try {
    const client = getTwilioClient();
    if (!client) {
      throw new Error('Twilio not configured');
    }

    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks
      .create({ to: phoneNumber, code });

    if (verificationCheck.status === 'approved') {
      // Update user metadata
      const { error } = await supabase.auth.admin.updateUserById(
        req.session.user.id,
        { user_metadata: { phone: phoneNumber, phone_verified: true } }
      );

      if (error) throw error;

      res.json({ success: true, verified: true });
    } else {
      res.json({ success: false, verified: false, error: 'Invalid code' });
    }
  } catch (error) {
    console.error('Twilio check error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check for Vercel
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
export default app;
