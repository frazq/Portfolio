import { OtodomScraper } from '../otodom-scraper';
import puppeteer from 'puppeteer';

// Mock puppeteer
jest.mock('puppeteer');

describe('OtodomScraper', () => {
  let scraper: OtodomScraper;
  let mockBrowser: any;
  let mockPage: any;

  beforeEach(() => {
    mockPage = {
      goto: jest.fn(),
      waitForSelector: jest.fn(),
      evaluate: jest.fn(),
      setUserAgent: jest.fn(),
      setViewport: jest.fn(),
      close: jest.fn(),
    };

    mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    };

    (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser);
    scraper = new OtodomScraper();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('scrapePropertyList', () => {
    it('should scrape property list successfully', async () => {
      // Mock successful response
      mockPage.evaluate.mockResolvedValue([
        {
          url: 'https://otodom.pl/property/1',
          title: 'Mieszkanie 3 pokoje',
          price: 500000,
          area: 60,
          rooms: 3,
        },
      ]);

      await scraper.initialize();
      const result = await scraper.scrapePropertyList('Warszawa', 600000, 1);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        title: 'Mieszkanie 3 pokoje',
        price: 500000,
        area: 60,
        rooms: 3,
      });
    });

    it('should handle scraping errors gracefully', async () => {
      mockPage.goto.mockRejectedValue(new Error('Network error'));

      await scraper.initialize();
      const result = await scraper.scrapePropertyList('Warszawa', 600000, 1);

      expect(result).toEqual([]);
    });

    it('should respect rate limiting', async () => {
      const startTime = Date.now();

      await scraper.initialize();
      await scraper.scrapePropertyList('Warszawa', 600000, 1);

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should include delay between requests
      expect(duration).toBeGreaterThan(2000);
    });
  });

  describe('scrapePropertyDetails', () => {
    it('should extract all property details correctly', async () => {
      const mockPropertyData = {
        title: 'Piękne mieszkanie w centrum',
        price: 750000,
        area: 80,
        rooms: 4,
        floor: 3,
        totalFloors: 10,
        buildYear: 2010,
        address: 'ul. Marszałkowska 1, Warszawa',
        description: 'Przestronne mieszkanie w doskonałej lokalizacji...',
        photos: [
          'https://apollo-ireland.akamaized.net/v1/files/photo1.jpg',
          'https://apollo-ireland.akamaized.net/v1/files/photo2.jpg',
        ],
        coordinates: { lat: 52.2297, lng: 21.0122 },
      };

      mockPage.evaluate.mockResolvedValue(mockPropertyData);

      await scraper.initialize();
      const result = await scraper.scrapePropertyDetails('https://otodom.pl/property/123');

      expect(result).toMatchObject(mockPropertyData);
    });

    it('should handle missing data fields', async () => {
      mockPage.evaluate.mockResolvedValue({
        title: 'Mieszkanie',
        price: 500000,
        // Missing other fields
      });

      await scraper.initialize();
      const result = await scraper.scrapePropertyDetails('https://otodom.pl/property/123');

      expect(result.title).toBe('Mieszkanie');
      expect(result.price).toBe(500000);
      expect(result.area).toBeUndefined();
    });
  });
});
