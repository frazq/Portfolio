import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Setup test data
    await page.goto('/dashboard');
  });

  test('should display properties list', async ({ page }) => {
    await expect(page.locator('[data-testid="properties-list"]')).toBeVisible();

    // Check if at least one property card is displayed
    await expect(page.locator('[data-testid="property-card"]').first()).toBeVisible();
  });

  test('should filter properties by price range', async ({ page }) => {
    // Open filters panel
    await page.click('[data-testid="filters-toggle"]');

    // Set price range
    await page.fill('[data-testid="min-price-input"]', '300000');
    await page.fill('[data-testid="max-price-input"]', '600000');

    // Apply filters
    await page.click('[data-testid="apply-filters"]');

    // Wait for results to load
    await page.waitForSelector('[data-testid="property-card"]');

    // Verify all displayed properties are within price range
    const propertyCards = page.locator('[data-testid="property-card"]');
    const count = await propertyCards.count();

    for (let i = 0; i < count; i++) {
      const priceText = await propertyCards.nth(i).locator('[data-testid="property-price"]').textContent();
      const price = parseInt(priceText.replace(/\D/g, ''));
      expect(price).toBeGreaterThanOrEqual(300000);
      expect(price).toBeLessThanOrEqual(600000);
    }
  });

  test('should create property alert', async ({ page }) => {
    // Click on first property
    await page.click('[data-testid="property-card"]:first-child');

    // Click create alert button
    await page.click('[data-testid="create-alert-button"]');

    // Fill alert form
    await page.fill('[data-testid="alert-name"]', 'Test Alert');
    await page.check('[data-testid="email-notifications"]');

    // Submit alert
    await page.click('[data-testid="submit-alert"]');

    // Verify success message
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Alert created successfully');
  });

  test('should switch between list and map view', async ({ page }) => {
    // Default should be list view
    await expect(page.locator('[data-testid="properties-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="properties-map"]')).not.toBeVisible();

    // Switch to map view
    await page.click('[data-testid="map-view-toggle"]');

    await expect(page.locator('[data-testid="properties-map"]')).toBeVisible();
    await expect(page.locator('[data-testid="properties-list"]')).not.toBeVisible();

    // Switch back to list view
    await page.click('[data-testid="list-view-toggle"]');

    await expect(page.locator('[data-testid="properties-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="properties-map"]')).not.toBeVisible();
  });
});
