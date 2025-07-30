import { PrismaClient, Property } from '@prisma/client';
import { InvestmentAnalysis } from '../analyzers/investment-analyzer';

const prisma = new PrismaClient();

interface PropertyFilters {
  priceRange?: [number, number];
  cities?: string[];
  minROI?: number;
  minInvestmentScore?: number;
  propertyTypes?: string[];
  maxRenovationCost?: number;
  sortBy?: 'score' | 'price' | 'roi' | 'date';
  page?: number;
  limit?: number;
}

interface PropertiesResponse {
  properties: Property[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  aggregations: {
    avgPrice: number;
    avgROI: number;
    totalOpportunities: number;
  };
}

export class PropertiesService {
  async getProperties(filters: PropertyFilters): Promise<PropertiesResponse> {
    const { page = 1, limit = 10, ...whereFilters } = filters;
    const where: any = {};
    if (whereFilters.priceRange) {
      where.price = {
        gte: whereFilters.priceRange[0],
        lte: whereFilters.priceRange[1],
      };
    }
    // Add other filters here

    const properties = await prisma.property.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
    const total = await prisma.property.count({ where });

    return {
      properties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      aggregations: {
        avgPrice: 0,
        avgROI: 0,
        totalOpportunities: 0,
      },
    };
  }

  async getPropertyById(id: string): Promise<Property | null> {
    return prisma.property.findUnique({ where: { id } });
  }

  async createProperty(data: any): Promise<Property> {
    return prisma.property.create({ data });
  }

  async createManyProperties(data: any[]): Promise<void> {
    await prisma.property.createMany({ data, skipDuplicates: true });
  }

  async getMarketAnalytics(city: string): Promise<any> {
      return {
          avgPrice: 0,
          totalProperties: 0
      }
  }
}
