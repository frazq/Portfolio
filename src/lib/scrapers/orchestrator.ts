import { OtodomScraper } from './otodom-scraper';
import { PropertiesService } from '../database/properties';
import { InvestmentAnalyzer } from '../analyzers/investment-analyzer';
import { PropertySource } from '@prisma/client';

export class ScraperOrchestrator {
  private propertiesService: PropertiesService;
  private investmentAnalyzer: InvestmentAnalyzer;

  constructor() {
    this.propertiesService = new PropertiesService();
    this.investmentAnalyzer = new InvestmentAnalyzer();
  }

  async runFullScraping(sources: string[]): Promise<void> {
    for (const source of sources) {
      const scraper = this.getScraper(source as PropertySource);
      if (scraper) {
        const properties = await scraper.scrapePropertyList('warszawa', 1000000, 1);
        for (const propertyData of properties) {
          const analysis = await this.investmentAnalyzer.analyzeProperty(propertyData);
          await this.propertiesService.createProperty({
            ...propertyData,
            source: source as PropertySource,
            ...analysis,
          });
        }
      }
    }
  }

  async updateExistingProperties(): Promise<void> {
    // Implementation for updating existing properties
  }

  async analyzeMarketTrends(): Promise<void> {
    // Implementation for analyzing market trends
  }

  private getScraper(source: PropertySource) {
    switch (source) {
      case 'OTODOM':
        return new OtodomScraper();
      default:
        return null;
    }
  }
}
