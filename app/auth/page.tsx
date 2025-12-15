'use client';

import { useState } from 'react';

export default function AuthPage() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const sendCode = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', phoneNumber: phone }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('Verification code sent to your phone');
        setStep('verify');
      } else {
        setError(data.error || 'Failed to send code');
      }
    } catch (err) {
      setError('Error: ' + String(err));
    } finally {
      setLoading(false);
    }
  };

  const submitCode = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', phoneNumber: phone, code }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Phone verified successfully!');
        setTimeout(() => {
          window.location.href = '/app';
        }, 1500);
      } else {
        setError('Invalid verification code');
      }
    } catch (err) {
      setError('Error: ' + String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Phone Verification</h1>
        
        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}

        {step === 'phone' ? (
          <>
            <p>Enter your phone number to receive a verification code</p>
            <input
              type="tel"
              placeholder="+1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />
            <button
              onClick={sendCode}
              disabled={!phone || loading}
              style={{ marginTop: '10px' }}
            >
              {loading ? 'Sending...' : 'Send Code'}
            </button>
          </>
        ) : (
          <>
            <p>Enter the 6-digit code sent to {phone}</p>
            <input
              type="text"
              placeholder="000000"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              disabled={loading}
            />
            <button
              onClick={submitCode}
              disabled={code.length !== 6 || loading}
              style={{ marginTop: '10px' }}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
            <button
              onClick={() => setStep('phone')}
              disabled={loading}
              style={{ marginTop: '10px', background: '#666' }}
            >
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}
