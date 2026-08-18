import { NextRequest, NextResponse } from 'next/server';
import { generateProvenanceBlessing } from '@/lib/groq';

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const {
      object = 'Ancestral Heirloom',
      concreteDetails = [],
      rootsFact = 'Generations have kept this craft unbroken.',
      rootsRegion = 'Ancestral Heritage Lineages',
      emotionalTone = 'Reverent Devotion',
      language,
    } = body;

    const safeDetails = Array.isArray(concreteDetails) && concreteDetails.length
      ? concreteDetails
      : ['Living memories passed down through family sanctuary', 'Sacred rituals preserved across generations'];

    const blessing = await generateProvenanceBlessing(
      object,
      safeDetails,
      rootsFact,
      rootsRegion,
      emotionalTone,
      language
    );

    return NextResponse.json(blessing);
  } catch (error: any) {
    console.error('Blessing API error:', error);
    return NextResponse.json({
      memory: [
        'You spoke of the love and memories preserved across family gatherings.',
        'In your words, this heirloom stands as an enduring beacon of roots.',
      ],
      context: 'Rooted in living cultural traditions: Handed down unbroken through ancestral touch.',
      telling: 'By the eternal hearth of the Ancestors, this sacred heirloom stands witness. The hands that shaped it and the hearts that guarded it speak through you now. May the flame of your memory guide the steps of all who follow.',
      usedDetails: ['Family Sanctuary', 'Living Memory'],
      badgeTitle: 'Keeper of the Ancestral Flame',
      badgeDescription: 'Honoring the living oral history woven across generations.',
    });
  }
}
