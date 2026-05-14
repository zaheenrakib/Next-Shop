


import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { saveOrder, getAllOrders } from "@/services/orderService";

export async function POST(req: Request) {
  try {
    const orderDetails = await req.json();


    const newOrder = await prisma.order.create({
      data: {
        orderId: orderDetails.orderId,
        customerName: orderDetails.customerInfo.name,
        email: orderDetails.customerInfo.email,
        phone: orderDetails.customerInfo.phone,
        address: orderDetails.customerInfo.fullAddress,
        comment: orderDetails.customerInfo.comment || "",

        totalAmount: Number(orderDetails.paymentInfo.totalAmount),
        shippingFee: Number(orderDetails.paymentInfo.shipping),
        paymentMethod: orderDetails.paymentInfo.method,

        status: 'PROCESSING',
        items: {
          create: orderDetails.orderItems.map((item: any) => ({
            productId: item.id,
            name: item.name,
            quantity: parseInt(item.qty),
            price: Number(item.unitPrice),
          })),
        },
      },
      include: { items: true }
    });

    return NextResponse.json({
      success: true,
      message: "অর্ডার সফলভাবে সেভ হয়েছে মামা!",
      order: newOrder
    });

  } catch (error: any) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}


export async function GET() {
  try {
    const orders = await getAllOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch orders" }, { status: 500 });
  }
}

