import puppeteer, { Browser, Page } from 'puppeteer';
import { Property, PropertySource } from '@prisma/client';

interface ScrapingConfig {
  headless: boolean;
  delay: { min: number; max: number };
  userAgents: string[];
  maxRetries: number;
  timeout: number;
}

interface PropertyData {
  url: string;
  title: string;
  price: number;
  area?: number;
  rooms?: number;
  floor?: number;
  address: string;
  city: string;
  photos: string[];
  description: string;
  coordinates?: { lat: number; lng: number };
}

class OtodomScraper {
  private browser: Browser | null = null;
  private config: ScrapingConfig;

  constructor() {
    this.config = {
      headless: true,
      delay: { min: 2000, max: 5000 },
      userAgents: [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        // dodaj więcej user agents
      ],
      maxRetries: 3,
      timeout: 30000
    };
  }

  async initialize(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: this.config.headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
  }

  async scrapePropertyList(
    city: string,
    priceMax: number,
    pages: number = 5
  ): Promise<PropertyData[]> {
    if (!this.browser) {
      throw new Error('Browser not initialized. Call initialize() first.');
    }

    const propertyLinks: string[] = [];
    const page = await this.browser.newPage();

    for (let i = 1; i <= pages; i++) {
      const url = `https://www.otodom.pl/pl/oferty/sprzedaz/mieszkanie/${city}?page=${i}&priceMax=${priceMax}`;
      await page.goto(url, { timeout: this.config.timeout, waitUntil: 'domcontentloaded' });
      await this.randomDelay();

      const links = await page.evaluate(() => {
        const linkNodes = document.querySelectorAll('a[data-cy="listing-item-link"]');
        const links: string[] = [];
        linkNodes.forEach(link => {
          if (link instanceof HTMLAnchorElement) {
            links.push(link.href);
          }
        });
        return links;
      });

      propertyLinks.push(...links);
    }

    const properties: PropertyData[] = [];
    for (const link of propertyLinks) {
      const property = await this.scrapePropertyDetails(link);
      if (property) {
        properties.push(property);
      }
    }

    await page.close();
    return properties;
  }

  async scrapePropertyDetails(url: string): Promise<PropertyData | null> {
    if (!this.browser) {
      throw new Error('Browser not initialized. Call initialize() first.');
    }

    const page = await this.browser.newPage();
    await page.setUserAgent(this.getRandomUserAgent());

    try {
      await page.goto(url, { timeout: this.config.timeout, waitUntil: 'domcontentloaded' });
      await this.randomDelay();

      const propertyData = await page.evaluate(() => {
        const title = document.querySelector('h1[data-cy="adPage__title"]')?.textContent?.trim() || '';
        const price = parseInt(document.querySelector('strong[data-cy="adPage__price"]')?.textContent?.replace(/\D/g, '') || '0');
        const area = parseFloat(document.querySelector('div[aria-label="Powierzchnia"] > div:nth-child(2)')?.textContent?.replace(',', '.') || '0');
        const rooms = parseInt(document.querySelector('div[aria-label="Liczba pokoi"] > div:nth-child(2)')?.textContent || '0');
        const floor = parseInt(document.querySelector('div[aria-label="Piętro"] > div:nth-child(2)')?.textContent || '0');
        const address = document.querySelector('a[aria-label="Adres"]')?.textContent?.trim() || '';
        const city = address.split(',').pop()?.trim() || '';
        const description = document.querySelector('div[data-cy="adPage__description"]')?.textContent?.trim() || '';

        const photos: string[] = [];
        const photoNodes = document.querySelectorAll('div[data-cy="adPage__gallery"] img');
        photoNodes.forEach(img => {
          if (img instanceof HTMLImageElement) {
            photos.push(img.src);
          }
        });

        return {
          url,
          title,
          price,
          area,
          rooms,
          floor,
          address,
          city,
          photos,
          description,
        };
      });

      return propertyData;
    } catch (error) {
      console.error(`Error scraping property details from ${url}:`, error);
      return null;
    } finally {
      await page.close();
    }
  }

  private async randomDelay(): Promise<void> {
    const delay = Math.random() *
      (this.config.delay.max - this.config.delay.min) +
      this.config.delay.min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private getRandomUserAgent(): string {
    return this.config.userAgents[
      Math.floor(Math.random() * this.config.userAgents.length)
    ];
  }
}
