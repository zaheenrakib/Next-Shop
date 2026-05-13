import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// অফার আপডেট করার জন্য (Edit & Status Toggle)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    
    const updatedOffer = await prisma.offer.update({
      where: { id },
      data: body,
    });
    
    return NextResponse.json(updatedOffer);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

// অফার ডিলিট করার জন্য
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await prisma.offer.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}