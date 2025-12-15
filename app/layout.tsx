import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Toy Soldiers KYC',
  description: 'Twilio KYC Verification Demo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
