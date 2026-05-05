import { NextResponse } from 'next/server';
import { createCategory, getCategories } from '@/services/categoryService';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, parent } = await req.json();
    const category = await createCategory({ name, parentId: parent === 'none' ? null : parent });
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/categories error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
