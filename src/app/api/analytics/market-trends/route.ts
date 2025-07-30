import { NextResponse } from 'next/server';

export async function GET() {
  // Get market trends
  return NextResponse.json({
    priceChanges: [],
    newListings: [],
    avgTimeOnMarket: 0,
    hotspots: [],
  });
}
