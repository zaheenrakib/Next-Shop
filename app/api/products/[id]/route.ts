import { NextResponse } from 'next/server';
import { getProductById, updateProduct } from '@/services/productService';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const product = await getProductById(params.id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    
    // মডাল থেকে যেহেতু { product: ..., variants: ... } পাঠানো হচ্ছে
    // তাই বডি থেকে product অংশটুকু আলাদা করে সার্ভিস ফাংশনে পাঠাতে হবে
    const productData = body.product; 

    if (!productData) {
       return NextResponse.json({ error: "No product data provided" }, { status: 400 });
    }

    const updatedProduct = await updateProduct(params.id, productData);
    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Cascade delete handling
    await prisma.$transaction([
      prisma.productSpecification.deleteMany({ where: { productId: params.id } }),
      prisma.variant.deleteMany({ where: { productId: params.id } }),
      prisma.product.delete({ where: { id: params.id } }),
    ]);
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}