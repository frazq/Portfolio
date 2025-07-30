import cron from 'node-cron';
import { ScraperOrchestrator } from '../scrapers/orchestrator';

class ScraperScheduler {
  private orchestrator: ScraperOrchestrator;

  constructor() {
    this.orchestrator = new ScraperOrchestrator();
  }

  start(): void {
    // Codziennie o 6:00 - nowe oferty
    cron.schedule('0 6 * * *', async () => {
      await this.orchestrator.runFullScraping(['OTODOM', 'OLX', 'GRATKA']);
    });

    // Co 4 godziny - update cen istniejących ofert
    cron.schedule('0 */4 * * *', async () => {
      await this.orchestrator.updateExistingProperties();
    });

    // Tygodniowo - analiza trendy rynkowych
    cron.schedule('0 0 * * 0', async () => {
      await this.orchestrator.analyzeMarketTrends();
    });
  }
}

// Placeholder for ScraperOrchestrator
class ScraperOrchestrator {
    runFullScraping(sources: string[]): Promise<void> {
        console.log(`Running full scraping for sources: ${sources.join(', ')}`);
        return Promise.resolve();
    }

    updateExistingProperties(): Promise<void> {
        console.log('Updating existing properties...');
        return Promise.resolve();
    }

    analyzeMarketTrends(): Promise<void> {
        console.log('Analyzing market trends...');
        return Promise.resolve();
    }
}
