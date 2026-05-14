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
    const body = await req.json();
    const attribute = await createAttribute(body);
    return NextResponse.json(attribute, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/attributes error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, ...data } = await req.json();
    const attribute = await updateAttribute(id, data);
    return NextResponse.json(attribute);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await deleteAttribute(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
