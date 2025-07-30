import { GET, POST } from '../route';
import { NextRequest } from 'next/server';
import { prismaMock } from '@/__mocks__/prisma';

// Mock Prisma
jest.mock('@/lib/database/prisma', () => ({
  __esModule: true,
  default: prismaMock,
}));

describe('/api/properties', () => {
  describe('GET', () => {
    it('should return properties with pagination', async () => {
      const mockProperties = [
        {
          id: '1',
          title: 'Test Property 1',
          price: 500000,
          city: 'Warszawa',
          investmentScore: 85,
        },
        {
          id: '2',
          title: 'Test Property 2',
          price: 400000,
          city: 'Kraków',
          investmentScore: 75,
        },
      ];

      prismaMock.property.findMany.mockResolvedValue(mockProperties);
      prismaMock.property.count.mockResolvedValue(2);

      const request = new NextRequest('http://localhost:3000/api/properties?page=1&limit=10');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.properties).toHaveLength(2);
      expect(data.pagination.total).toBe(2);
    });

    it('should filter properties by price range', async () => {
      prismaMock.property.findMany.mockResolvedValue([]);
      prismaMock.property.count.mockResolvedValue(0);

      const request = new NextRequest('http://localhost:3000/api/properties?minPrice=300000&maxPrice=600000');
      const response = await GET(request);

      expect(prismaMock.property.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            price: {
              gte: 300000,
              lte: 600000,
            },
          }),
        })
      );
    });

    it('should handle invalid query parameters', async () => {
      const request = new NextRequest('http://localhost:3000/api/properties?page=invalid');
      const response = await GET(request);

      expect(response.status).toBe(400);
    });
  });

  describe('POST', () => {
    it('should create new property alert', async () => {
      const alertData = {
        name: 'Test Alert',
        filters: {
          priceRange: [300000, 600000],
          cities: ['Warszawa'],
        },
        notifications: {
          email: true,
          sms: false,
        },
      };

      const mockAlert = { id: '1', ...alertData };
      prismaMock.propertyAlert.create.mockResolvedValue(mockAlert);

      const request = new NextRequest('http://localhost:3000/api/properties', {
        method: 'POST',
        body: JSON.stringify(alertData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.id).toBe('1');
    });
  });
});
