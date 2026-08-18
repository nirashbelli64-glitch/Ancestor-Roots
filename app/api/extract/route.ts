import { NextRequest, NextResponse } from 'next/server';
import { extractMemoryInsights } from '@/lib/groq';

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const { object = 'Ancestral Heirloom', answers = [], language } = body;
    const safeAnswers = Array.isArray(answers) ? answers : [];

    const extracted = await extractMemoryInsights(object, safeAnswers, language);
    return NextResponse.json(extracted);
  } catch (error: any) {
    console.error('Extract API error:', error);
    return NextResponse.json({
      concreteDetails: ['Preserved in family sanctuary', 'Passed through generations with love'],
      emotionalTone: 'Reverent Devotion & Nostalgia',
      keywords: ['Lineage', 'Hearth', 'Sanctuary', 'Migration', 'Devotion'],
      ancestralThemes: ['Intergenerational Memory', 'Living Roots'],
    });
  }
}
