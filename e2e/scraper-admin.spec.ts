import { test, expect } from '@playwright/test';

test.describe('Scraper Administration E2E', () => {
  test('should start and monitor scraping process', async ({ page }) => {
    await page.goto('/admin/scrapers');

    // Start scraping
    await page.click('[data-testid="start-scraping-button"]');

    // Configure scraping parameters
    await page.check('[data-testid="source-otodom"]');
    await page.check('[data-testid="source-olx"]');
    await page.fill('[data-testid="max-price"]', '1000000');
    await page.selectOption('[data-testid="cities-select"]', ['Warszawa', 'Kraków']);

    // Submit scraping job
    await page.click('[data-testid="submit-scraping-job"]');

    // Monitor progress
    await expect(page.locator('[data-testid="scraping-status"]')).toContainText('Running');

    // Wait for completion (with timeout)
    await page.waitForSelector('[data-testid="scraping-complete"]', { timeout: 60000 });

    // Verify results
    const resultText = await page.locator('[data-testid="scraping-results"]').textContent();
    expect(resultText).toMatch(/\d+ properties scraped/);
  });
});
