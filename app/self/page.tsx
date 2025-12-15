'use client';

import Link from 'next/link';

export default function SelfPage() {
  return (
    <div className="container">
      <div className="card">
        <h1>Profile</h1>
        
        <div style={{ marginTop: '20px' }}>
          <h2>Account Information</h2>
          <p><strong>User ID:</strong> demo_user_123</p>
          <p><strong>Phone:</strong> ••••••••••</p>
          <p><strong>Verification Status:</strong> ✅ Verified</p>
          <p><strong>KYC Status:</strong> Pending Review</p>
          <p><strong>Created:</strong> 2025-12-14</p>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h2>Verification Details</h2>
          <p>Your phone number has been successfully verified via SMS.</p>
          <p>This verification is required for KYC compliance.</p>
        </div>

        <div style={{ marginTop: '20px' }}>
          <Link href="/app">
            <button>Back to Dashboard</button>
          </Link>
          <Link href="/">
            <button style={{ marginLeft: '10px', background: '#666' }}>Home</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
