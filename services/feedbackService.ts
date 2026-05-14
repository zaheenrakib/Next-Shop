// services/feedbackService.ts
import prisma from '@/lib/prisma';

export async function createFeedback(data: {
  fullName: string;
  phoneNo: string;
  email?: string;
  subject: string;
  details: string;
}) {
  return await prisma.feedback.create({
    data: {
      fullName: data.fullName,
      phoneNo: data.phoneNo,
      email: data.email || null,
      subject: data.subject,
      details: data.details,
    },
  });
}

// প্রফেশনাল অ্যাডমিন গেট অল (সার্চ, ফিল্টার ও পেজিনেশন সহ)
export async function getAllFeedbacks({
  search = '',
  status = 'all',
  page = 1,
  limit = 10
}: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const skip = (page - 1) * limit;

  // ফিল্টারিং কন্ডিশন তৈরি
  const whereCondition: any = {};

  if (status !== 'all') {
    whereCondition.status = status;
  }

  if (search) {
    whereCondition.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { phoneNo: { contains: search, mode: 'insensitive' } },
      { subject: { contains: search, mode: 'insensitive' } },
    ];
  }

  // ডাটা এবং টোটাল কাউন্ট এক সাথে আনা (পেজিনেশনের হিসাবের জন্য)
  const [feedbacks, totalCount] = await Promise.all([
    prisma.feedback.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.feedback.count({ where: whereCondition }),
  ]);

  return {
    feedbacks,
    meta: {
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    }
  };
}

export async function updateFeedbackStatus(id: string, status: string) {
  return await prisma.feedback.update({
    where: { id },
    data: { status },
  });
}

export async function deleteFeedback(id: string) {
  return await prisma.feedback.delete({
    where: { id },
  });
}