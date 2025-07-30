import { performance } from 'perf_hooks';
import { PropertiesService } from '@/lib/database/properties';
import { setupTestDatabase, cleanupTestDatabase } from '@/test-utils/database';

describe('Database Performance Tests', () => {
  let propertiesService: PropertiesService;

  beforeAll(async () => {
    await setupTestDatabase();
    propertiesService = new PropertiesService();

    // Seed test data
    await seedLargeDataset();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  test('should retrieve properties list within acceptable time', async () => {
    const startTime = performance.now();

    const result = await propertiesService.getProperties({
      page: 1,
      limit: 50,
      filters: {
        priceRange: [300000, 800000],
        cities: ['Warszawa', 'Kraków'],
      },
    });

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(result.properties).toHaveLength(50);
    expect(duration).toBeLessThan(500); // Should complete within 500ms
  });

  test('should handle concurrent requests efficiently', async () => {
    const concurrentRequests = 10;
    const startTime = performance.now();

    const promises = Array(concurrentRequests).fill(null).map(() =>
      propertiesService.getProperties({
        page: 1,
        limit: 20,
        filters: { priceRange: [200000, 1000000] },
      })
    );

    const results = await Promise.all(promises);

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(results).toHaveLength(concurrentRequests);
    expect(duration).toBeLessThan(2000); // All requests within 2 seconds
  });

  test('should perform complex analytics queries efficiently', async () => {
    const startTime = performance.now();

    const analytics = await propertiesService.getMarketAnalytics('Warszawa');

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(analytics.avgPrice).toBeDefined();
    expect(analytics.totalProperties).toBeGreaterThan(0);
    expect(duration).toBeLessThan(1000); // Analytics within 1 second
  });

  async function seedLargeDataset() {
    // Create 10,000 test properties for performance testing
    const properties = Array(10000).fill(null).map((_, index) => ({
      url: `https://test.com/property/${index}`,
      title: `Test Property ${index}`,
      price: 300000 + Math.random() * 700000,
      area: 30 + Math.random() * 120,
      rooms: Math.floor(Math.random() * 5) + 1,
      address: `ul. Testowa ${index}, Warszawa`,
      city: ['Warszawa', 'Kraków', 'Gdańsk'][Math.floor(Math.random() * 3)],
      source: 'OTODOM',
      investmentScore: Math.random() * 100,
    }));

    await propertiesService.createManyProperties(properties);
  }
});
