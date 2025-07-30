import { NextRequest, NextResponse } from 'next/server';
import { ScraperOrchestrator } from '@/lib/scrapers/orchestrator';
import { setScrapingStatus, isScraping } from '@/lib/scrapers/status';

export async function POST(request: NextRequest) {
  if (isScraping) {
    return NextResponse.json({ message: 'Scraping is already in progress' }, { status: 400 });
  }

  setScrapingStatus(true);
  const orchestrator = new ScraperOrchestrator();
  orchestrator.runFullScraping(['OTODOM']).finally(() => {
    setScrapingStatus(false);
  });

  return NextResponse.json({ message: 'Scraping started' });
}
