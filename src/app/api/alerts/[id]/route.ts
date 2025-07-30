import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  // Update alert
  return NextResponse.json({ message: `Alert ${params.id} updated` });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Delete alert
  return NextResponse.json({ message: `Alert ${params.id} deleted` });
}
