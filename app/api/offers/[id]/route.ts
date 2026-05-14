import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


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


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await prisma.offer.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}