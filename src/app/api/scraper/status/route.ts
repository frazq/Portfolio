import { NextResponse } from 'next/server';
import { isScraping } from '@/lib/scrapers/status';

export async function GET() {
  // A more advanced status tracking would be needed for a real application
  return NextResponse.json({
    isRunning: isScraping,
    lastRun: new Date(), // This should be stored
    nextRun: new Date(), // This should be calculated based on the cron job
    statistics: {
      totalScraped: 0, // This should be tracked
      newProperties: 0,
      updatedProperties: 0,
      errors: 0,
    },
  });
}
