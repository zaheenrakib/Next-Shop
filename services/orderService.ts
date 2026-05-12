
// import prisma from '@/lib/prisma';

// export const saveOrder = async (orderDetails: any) => {
//   return await prisma.order.create({
//     data: {
//       orderId: orderDetails.orderId,
//       customerName: orderDetails.customerInfo.name,
//       email: orderDetails.customerInfo.email,
//       phone: orderDetails.customerInfo.phone,
//       address: orderDetails.customerInfo.fullAddress,
//       comment: orderDetails.customerInfo.comment,
//       totalAmount: orderDetails.paymentInfo.totalAmount,
//       shippingFee: orderDetails.paymentInfo.shipping,
//       paymentMethod: orderDetails.paymentInfo.method,
//       items: {
//         create: orderDetails.orderItems.map((item: any) => ({
//           productId: item.id,
//           name: item.name,
//           quantity: item.qty,
//           price: item.unitPrice,
//         })),
//       },
//     },
//   });
// };




import prisma from '@/lib/prisma';

// ১. নতুন অর্ডার সেভ করা (আপনার আগের কোডটি এখানে আপডেট করা হয়েছে)
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
      status: 'processing', // ডিফল্ট স্ট্যাটাস
      items: {
        create: orderDetails.orderItems.map((item: any) => ({
          productId: item.id,
          name: item.name,
          quantity: item.qty,
          price: item.unitPrice,
        })),
      },
    },
    include: { items: true }
  });
};

// ২. অ্যাডমিন প্যানেলের জন্য সব অর্ডার ফেচ করা
export const getAllOrders = async () => {
  return await prisma.order.findMany({
    include: {
      items: true, // অর্ডারের ভেতরের আইটেমগুলোও নিয়ে আসবে
    },
    orderBy: {
      createdAt: 'desc', // নতুন অর্ডার সবার উপরে থাকবে
    },
  });
};

// ৩. অর্ডারের স্ট্যাটাস আপডেট করা (Shipped, Delivered, etc.)
export const updateOrderStatus = async (id: string, status: string) => {
  return await prisma.order.update({
    where: { id },
    data: { status },
  });
};