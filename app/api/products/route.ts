import { NextResponse } from 'next/server';
import { createProduct, getProducts } from '@/services/productService';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('category');
    const brandId = searchParams.get('brand');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const result = await getProducts({ categoryId, brandId, search }, { page, limit });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { product, variants } = body;
    
    if (!product || !variants || !Array.isArray(variants)) {
      return NextResponse.json({ error: "Invalid request body. 'product' and 'variants' are required." }, { status: 400 });
    }

    const newProduct = await createProduct(product, variants);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
