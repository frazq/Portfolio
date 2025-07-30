import { NextRequest, NextResponse } from 'next/server';
import { PropertiesService } from '@/lib/database/properties';

const propertiesService = new PropertiesService();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const property = await propertiesService.getPropertyById(id);

  if (!property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  return NextResponse.json(property);
}
