'use client';

import Link from 'next/link';

export default function AppPage() {
  return (
    <div className="container">
      <div className="card">
        <h1>Dashboard</h1>
        <p>Welcome to your Toy Soldiers KYC dashboard</p>
        
        <div style={{ marginTop: '20px' }}>
          <h2>Your Status</h2>
          <p>✅ Phone Verified</p>
          <p>📋 KYC Status: In Progress</p>
          <p>🔐 Account Status: Active</p>
        </div>

        <div style={{ marginTop: '20px' }}>
          <Link href="/self">
            <button>View Profile</button>
          </Link>
          <Link href="/">
            <button style={{ marginLeft: '10px', background: '#666' }}>Home</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
