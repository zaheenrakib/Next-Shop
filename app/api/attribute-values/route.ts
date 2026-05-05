import { NextResponse } from 'next/server';
import { createAttributeValue, getAttributeValues } from '@/services/attributeService';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const attributeId = searchParams.get('attributeId');
    const values = await getAttributeValues(attributeId || undefined);
    return NextResponse.json(values);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { attributeId, value } = await req.json();
    const attrValue = await createAttributeValue(attributeId, value);
    return NextResponse.json(attrValue, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
