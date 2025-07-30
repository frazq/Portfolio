import { NextRequest, NextResponse } from 'next/server';
import { setScrapingStatus, isScraping } from '@/lib/scrapers/status';

export async function POST(request: NextRequest) {
  if (!isScraping) {
    return NextResponse.json({ message: 'Scraping is not in progress' }, { status: 400 });
  }

  // This is a simplified implementation. A real implementation would need to
  // gracefully stop the running scrapers.
  setScrapingStatus(false);

  return NextResponse.json({ message: 'Scraping stopped' });
}
