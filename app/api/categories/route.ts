import { NextResponse } from 'next/server';
import { createCategory, getCategories, deleteCategory } from '@/services/categoryService'; // deleteCategory সার্ভিসটি ইম্পোর্ট করে নিন

// ক্যাটাগরি নিয়ে আসার জন্য (GET)
export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// নতুন ক্যাটাগরি তৈরি করার জন্য (POST)
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

// ক্যাটাগরি ডিলিট করার জন্য (DELETE)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id'); // URL থেকে query parameter হিসেবে id নেওয়া হচ্ছে (যেমন: /api/categories?id=123)

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    await deleteCategory(id); // আপনার সার্ভিস থেকে ডিলিট ফাংশনটি কল করা হচ্ছে
    
    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('DELETE /api/categories error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}