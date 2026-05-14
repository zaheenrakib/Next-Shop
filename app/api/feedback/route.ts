// app/api/feedback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createFeedback, getAllFeedbacks } from '@/services/feedbackService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await createFeedback(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const data = await getAllFeedbacks({ search, status, page, limit });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}