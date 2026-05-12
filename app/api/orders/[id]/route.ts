import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/services/orderService";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json();
    const updatedOrder = await updateOrderStatus(params.id, status);
    
    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
  }
}