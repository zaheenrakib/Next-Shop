import { NextResponse } from 'next/server';
import { createCategory, getCategories, deleteCategory } from '@/services/categoryService';

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

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id'); 

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    await deleteCategory(id); 
    
    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('DELETE /api/categories error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}