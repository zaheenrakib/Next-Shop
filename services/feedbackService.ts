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