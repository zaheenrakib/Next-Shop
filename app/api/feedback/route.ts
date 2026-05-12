import { NextRequest, NextResponse } from 'next/server';
import { createFeedback } from '@/services/feedbackService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await createFeedback(body);
    return NextResponse.json({ message: "Feedback submitted successfully", result }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}