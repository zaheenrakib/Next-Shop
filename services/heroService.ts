

































































import prisma from "@/lib/prisma";

export const heroService = {
  async getHeroData() {
    try {
      return await prisma.heroSlider.findMany({
        orderBy: { updatedAt: 'desc' }
      });
    } catch (error) {
      console.error("Prisma Get Error:", error);
      throw error;
    }
  },

  async updateHeroData(payload: {
    id?: string;
    imageUrl: string;
    title: string;
    subtitle: string;
    buttonLink: string;
    isActive?: boolean;
  }) {
    try {
      const { id, ...data } = payload;

      if (id) {
        return await prisma.heroSlider.update({
          where: { id },
          data: data,
        });
      }

      return await prisma.heroSlider.create({
        data: {
          imageUrl: data.imageUrl,
          title: data.title,
          subtitle: data.subtitle,
          buttonLink: data.buttonLink,
          isActive: data.isActive ?? true,
        },
      });
    } catch (error) {
      console.error("Prisma Update/Create Error:", error);
      throw error;
    }
  },

  async deleteHeroData(id: string) {
    try {
      return await prisma.heroSlider.delete({
        where: { id },
      });
    } catch (error) {
      console.error("Prisma Delete Error:", error);
      throw error;
    }
  },
};