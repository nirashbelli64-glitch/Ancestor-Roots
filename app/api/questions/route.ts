import { NextRequest, NextResponse } from 'next/server';
import { generateHeritageQuestions } from '@/lib/groq';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { object, details, previousContext, language } = body;

    if (!object || !Array.isArray(details)) {
      return NextResponse.json(
        { error: 'Object name and details array are required' },
        { status: 400 }
      );
    }

    const questions = await generateHeritageQuestions(object, details, previousContext, language);
    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error('Questions API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate heritage questions' },
      { status: 500 }
    );
  }
}
