import { NextResponse } from 'next/server';
import { createAttribute, getAttributes } from '@/services/attributeService';

export async function GET() {
  try {
    const attributes = await getAttributes();
    return NextResponse.json(attributes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    const attribute = await createAttribute(name);
    return NextResponse.json(attribute, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/attributes error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
