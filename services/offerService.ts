"use server"

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createOfferAction(formData: any) {
  try {
    const offer = await prisma.offer.create({
      data: {
        mainTitle: formData.mainTitle,
        subHeadline: formData.subHeadline,
        imageUrl: formData.imageUrl,
        availability: formData.availability,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        emiLink: formData.emiLink,
        status: formData.status,
        rewards: formData.rewards,
        termsAndConditions: formData.termsAndConditions,
      },
    });

    revalidatePath("/admin/offers"); // Update your listing page path
    return { success: true, data: JSON.parse(JSON.stringify(offer)) };
  } catch (error: any) {
    console.error("Database Error:", error);
    return { success: false, error: error.message || "Failed to process request" };
  }
}

export async function getOffers() {
  try {
    const offers = await prisma.offer.findMany({
      where: { status: "active" },
      orderBy: { createdAt: "desc" },
    });
    return JSON.parse(JSON.stringify(offers)); // সিরিয়ালাইজেশন নিশ্চিত করতে
  } catch (error) {
    console.error("Fetch Offers Error:", error);
    return [];
  }
}