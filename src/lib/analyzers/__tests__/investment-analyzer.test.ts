import { InvestmentAnalyzer } from '../investment-analyzer';
import { PropertyData } from '@/types/property';

describe('InvestmentAnalyzer', () => {
  let analyzer: InvestmentAnalyzer;

  beforeEach(() => {
    analyzer = new InvestmentAnalyzer();
  });

  describe('analyzeProperty', () => {
    const mockProperty: PropertyData = {
      url: 'https://otodom.pl/property/123',
      title: 'Mieszkanie 3 pokoje',
      price: 500000,
      area: 60,
      rooms: 3,
      floor: 2,
      address: 'ul. Testowa 1, Warszawa',
      city: 'Warszawa',
      photos: [],
      description: 'Mieszkanie w dobrym stanie',
      coordinates: { lat: 52.2297, lng: 21.0122 },
    };

    it('should calculate investment score correctly', async () => {
      const result = await analyzer.analyzeProperty(mockProperty);

      expect(result.investmentScore).toBeGreaterThan(0);
      expect(result.investmentScore).toBeLessThanOrEqual(100);
      expect(result.marketValue).toBeGreaterThan(0);
      expect(result.roi).toBeDefined();
    });

    it('should identify undervalued properties', async () => {
      const undervaluedProperty = {
        ...mockProperty,
        price: 300000, // Significantly below market
      };

      const result = await analyzer.analyzeProperty(undervaluedProperty);

      expect(result.investmentScore).toBeGreaterThan(70);
      expect(result.reasons).toContain('Property is significantly undervalued');
    });

    it('should flag overpriced properties', async () => {
      const overpricedProperty = {
        ...mockProperty,
        price: 800000, // Significantly above market
      };

      const result = await analyzer.analyzeProperty(overpricedProperty);

      expect(result.investmentScore).toBeLessThan(50);
      expect(result.riskLevel).toBe('HIGH');
    });
  });

  describe('calculateROI', () => {
    it('should calculate ROI correctly', () => {
      const purchasePrice = 500000;
      const renovationCost = 50000;
      const monthlyRent = 3000;

      const roi = analyzer.calculateROI(purchasePrice, renovationCost, monthlyRent);

      // Expected ROI: (3000 * 12) / (500000 + 50000) * 100 = 6.54%
      expect(roi).toBeCloseTo(6.54, 1);
    });

    it('should handle zero rental income', () => {
      const roi = analyzer.calculateROI(500000, 50000, 0);
      expect(roi).toBe(0);
    });
  });
});
