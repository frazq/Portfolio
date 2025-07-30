import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // Get user's active alerts
  return NextResponse.json([]);
}

export async function POST(request: NextRequest) {
  // Create new alert
  return NextResponse.json({ message: 'Alert created' }, { status: 201 });
}
