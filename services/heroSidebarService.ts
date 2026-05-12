
// @/services/heroSidebarService.ts
import prisma from "@/lib/prisma";

export const heroSidebarService = {
  async getSidebarData() {
    return await prisma.heroSidebar.findMany({
      orderBy: { updatedAt: 'desc' } // নতুনগুলো আগে দেখাবে
    });
  },

  async upsertSidebarData(payload: { id?: string; imageUrl: string; targetUrl: string; isActive?: boolean }) {
    const { id, ...data } = payload;

    if (id) {
      // যদি ID থাকে তবে আপডেট করো
      return await prisma.heroSidebar.update({
        where: { id },
        data: data,
      });
    }

    // ID না থাকলে নতুন ক্রিয়েট করো
    return await prisma.heroSidebar.create({
      data: {
        imageUrl: data.imageUrl,
        targetUrl: data.targetUrl,
        isActive: data.isActive ?? true,
      },
    });
  },

  async deleteSidebarData(id: string) {
    return await prisma.heroSidebar.delete({
      where: { id },
    });
  }
};