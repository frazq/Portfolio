import { setupTestDatabase, cleanupTestDatabase } from '@/test-utils/database';
import { OtodomScraper } from '@/lib/scrapers/otodom-scraper';
import { InvestmentAnalyzer } from '@/lib/analyzers/investment-analyzer';
import { PropertiesService } from '@/lib/database/properties';

describe('Scraping Workflow Integration', () => {
  let propertiesService: PropertiesService;
  let scraper: OtodomScraper;
  let analyzer: InvestmentAnalyzer;

  beforeAll(async () => {
    await setupTestDatabase();
    propertiesService = new PropertiesService();
    scraper = new OtodomScraper();
    analyzer = new InvestmentAnalyzer();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  it('should complete full scraping and analysis workflow', async () => {
    // 1. Scrape properties
    const mockPropertyData = {
      url: 'https://otodom.pl/property/test-123',
      title: 'Test Property',
      price: 500000,
      area: 60,
      rooms: 3,
      address: 'ul. Testowa 1, Warszawa',
      city: 'Warszawa',
      photos: [],
      description: 'Test property description',
    };

    // Mock scraper response
    jest.spyOn(scraper, 'scrapePropertyList').mockResolvedValue([mockPropertyData]);

    // 2. Analyze property
    const analysis = await analyzer.analyzeProperty(mockPropertyData);
    expect(analysis.investmentScore).toBeDefined();

    // 3. Save to database
    const savedProperty = await propertiesService.createProperty({
      ...mockPropertyData,
      source: 'OTODOM',
      ...analysis,
    });

    expect(savedProperty.id).toBeDefined();
    expect(savedProperty.investmentScore).toBe(analysis.investmentScore);

    // 4. Verify property can be retrieved
    const retrievedProperty = await propertiesService.getPropertyById(savedProperty.id);
    expect(retrievedProperty).toBeTruthy();
    expect(retrievedProperty.title).toBe(mockPropertyData.title);
  }, 30000);

  it('should handle duplicate properties correctly', async () => {
    const propertyData = {
      url: 'https://otodom.pl/property/duplicate-test',
      title: 'Duplicate Test Property',
      price: 400000,
      area: 50,
      rooms: 2,
      address: 'ul. Duplikat 1, Kraków',
      city: 'Kraków',
      photos: [],
      description: 'Duplicate test',
    };

    // Create property first time
    const firstProperty = await propertiesService.createProperty({
      ...propertyData,
      source: 'OTODOM',
      investmentScore: 75,
    });

    // Try to create same property again
    const secondProperty = await propertiesService.createProperty({
      ...propertyData,
      source: 'OTODOM',
      investmentScore: 75,
    });

    // Should update existing property, not create new one
    expect(firstProperty.id).toBe(secondProperty.id);
    expect(secondProperty.lastUpdatedAt).not.toBe(firstProperty.lastUpdatedAt);
  });
});
