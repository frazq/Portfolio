import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Calculate ROI
  return NextResponse.json({
    monthlyRent: 0,
    annualROI: 0,
    paybackPeriod: 0,
    totalCosts: 0,
    projectedValue: 0,
  });
}
