import { NextRequest, NextResponse } from 'next/server';
import { PropertiesService } from '@/lib/database/properties';
import { z } from 'zod';

const propertiesService = new PropertiesService();

const propertyFiltersSchema = z.object({
  priceRange: z.tuple([z.number(), z.number()]).optional(),
  cities: z.array(z.string()).optional(),
  minROI: z.number().min(0).max(100).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  // ... more validation rules
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  const filters: any = { page, limit };
  if (minPrice && maxPrice) {
    filters.priceRange = [parseInt(minPrice), parseInt(maxPrice)];
  }

  try {
    const validatedFilters = propertyFiltersSchema.parse(filters);
    const response = await propertiesService.getProperties(validatedFilters);
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
    // create property alert
    // This should be in the alerts route
    return NextResponse.json({ message: 'This endpoint is not for creating alerts.' }, { status: 400 });
}
