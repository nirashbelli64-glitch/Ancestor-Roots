import { NextRequest, NextResponse } from 'next/server';
import { lookupRootsContext } from '@/lib/groq';

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const { object = 'Ancestral Heirloom', keywords = [], details = [], language } = body;

    const roots = await lookupRootsContext(
      object,
      Array.isArray(keywords) ? keywords : [],
      Array.isArray(details) ? details : [],
      language
    );
    return NextResponse.json(roots);
  } catch (error: any) {
    console.error('Roots API error:', error);
    return NextResponse.json({
      region: 'Ancestral Cultural Crossroads & Artisan Lineages',
      historicalEra: 'Early 20th Century Craft Guilds',
      fact: 'Across traditional craft communities, heirlooms were consecrated to preserve ancestral lineage unbroken across migrations.',
      source: 'Living Traditions Heritage Archives',
      culturalSignificance: 'An enduring conduit between ancestral origin and living memory.',
    });
  }
}
