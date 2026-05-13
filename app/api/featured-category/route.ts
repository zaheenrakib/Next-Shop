import { NextResponse } from "next/server";
import prisma  from "@/lib/prisma"; // আপনার প্রিজমা ক্লায়েন্ট পাথ অনুযায়ী চেঞ্জ করুন

export async function GET() {
  try {
    const categories = await prisma.featuredCategory.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const category = await prisma.featuredCategory.create({
      data: {
        name: body.name,
        iconUrl: body.iconUrl,
        destinationUrl: body.destinationUrl,
        isActive: true,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}