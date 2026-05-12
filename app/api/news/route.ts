import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const news = await prisma.news.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, title, description, imageUrl, isActive } = body;

    if (id) {
      const updated = await prisma.news.update({
        where: { id },
        data: { title, description, imageUrl, isActive },
      });
      return NextResponse.json(updated);
    }

    const created = await prisma.news.create({
      data: { title, description, imageUrl, isActive: isActive ?? true },
    });
    return NextResponse.json(created);
  } catch (error) {
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.news.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}