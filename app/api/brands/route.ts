import { NextResponse } from 'next/server';
import Brand from '@/models/Brand';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    const brands = await Brand.find();
    return NextResponse.json(brands);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name } = await req.json();
    const brand = new Brand({ name });
    await brand.save();
    return NextResponse.json(brand, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
