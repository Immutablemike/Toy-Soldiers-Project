'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <div className="card">
        <h1>Toy Soldiers KYC Verification</h1>
        <p>Twilio-powered phone verification for Know Your Customer compliance</p>
        
        <div style={{ marginTop: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link href="/auth">
            <button>Start Verification</button>
          </Link>
          <Link href="/app">
            <button>Dashboard</button>
          </Link>
          <Link href="/self">
            <button>Profile</button>
          </Link>
        </div>

        <hr style={{ margin: '30px 0' }} />
        
        <h2>What this does:</h2>
        <ul>
          <li>Phone number verification via SMS (Twilio Verify)</li>
          <li>User authentication (Supabase)</li>
          <li>KYC compliance tracking</li>
          <li>Secure session management</li>
        </ul>

        <h2>Live on Vercel</h2>
        <p>This application is deployed and ready for Twilio auditors to review.</p>
      </div>
    </div>
  );
}
