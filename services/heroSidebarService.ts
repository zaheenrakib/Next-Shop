

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

      return await prisma.heroSidebar.update({
        where: { id },
        data: data,
      });
    }


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