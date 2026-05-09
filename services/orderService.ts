
import prisma from '@/lib/prisma';

export const saveOrder = async (orderDetails: any) => {
  return await prisma.order.create({
    data: {
      orderId: orderDetails.orderId,
      customerName: orderDetails.customerInfo.name,
      email: orderDetails.customerInfo.email,
      phone: orderDetails.customerInfo.phone,
      address: orderDetails.customerInfo.fullAddress,
      comment: orderDetails.customerInfo.comment,
      totalAmount: orderDetails.paymentInfo.totalAmount,
      shippingFee: orderDetails.paymentInfo.shipping,
      paymentMethod: orderDetails.paymentInfo.method,
      items: {
        create: orderDetails.orderItems.map((item: any) => ({
          productId: item.id,
          name: item.name,
          quantity: item.qty,
          price: item.unitPrice,
        })),
      },
    },
  });
};