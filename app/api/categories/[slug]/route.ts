import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // আপনার প্রিজমা ক্লায়েন্ট পাথ

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;


    const products = await prisma.product.findMany({
      where: {
        category: {

          name: {
            equals: slug.charAt(0).toUpperCase() + slug.slice(1), // Mobile হিসেবে সার্চ করবে
            mode: 'insensitive' // ক্যাপিটাল বা স্মল লেটার যাই হোক খুঁজে পাবে
          }
        }
      },
      include: {
        category: true,
        brand: true,
        specifications: true
      }
    });

    if (!products || products.length === 0) {
      return NextResponse.json({ message: "No products found for this category" }, { status: 404 });
    }

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Category Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}