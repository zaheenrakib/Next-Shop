import { NextResponse } from "next/server";
import { saveOrder } from "@/services/orderService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const order = await saveOrder(body);
    
    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ success: false, message: "Order failed" }, { status: 500 });
  }
}