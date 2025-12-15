import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationCode, verifyCode } from '@/lib/twilio';

export async function POST(req: NextRequest) {
  try {
    const { action, phoneNumber, code } = await req.json();

    if (action === 'send') {
      const result = await sendVerificationCode(phoneNumber);
      return NextResponse.json(result);
    }

    if (action === 'verify') {
      const result = await verifyCode(phoneNumber, code);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
