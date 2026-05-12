import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/services/productService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const categoryId = searchParams.get('category');
    const brandId = searchParams.get('brand');
    const search = searchParams.get('search');
    const maxPrice = searchParams.get('maxPrice'); // বাজেট রিসিভ করা হচ্ছে
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12'); // একবারে ১২টা প্রোডাক্ট দেখালে গ্রিড সুন্দর লাগে

    const result = await getProducts(
      { categoryId, brandId, search, maxPrice }, 
      { page, limit }
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product, variants } = body;
    
    if (!product) {
      return NextResponse.json(
        { error: "Product data is required" }, 
        { status: 400 }
      );
    }

    const newProduct = await createProduct(product, variants || []);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

