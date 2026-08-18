import { NextRequest, NextResponse } from 'next/server';
import { scanObjectWithVision } from '@/lib/groq';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, categoryHint, customName } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'Image base64 is required for visual scan' },
        { status: 400 }
      );
    }

    const result = await scanObjectWithVision(image, categoryHint, customName);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Scan API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to scan object' },
      { status: 500 }
    );
  }
}
