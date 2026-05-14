
import prisma from '@/lib/prisma';

export async function createCategory(data: { name: string; parentId?: string | null }) {
  return await prisma.category.create({
    data: {
      name: data.name,
      parentId: (data.parentId === 'none' || !data.parentId) ? null : data.parentId,
    },
  });
}

export async function getCategories() {
  return await prisma.category.findMany({
    include: {
      parent: true,
      categoryAttributes: {
        include: {
          attribute: true
        }
      }
    },
  });
}

export async function getCategoryTree() {
  const categories = await prisma.category.findMany();

  const buildTree = (parentId: string | null = null): any[] => {
    return categories
      .filter(cat => cat.parentId === parentId)
      .map(cat => ({
        ...cat,
        children: buildTree(cat.id)
      }));
  };

  return buildTree(null);
}


export async function deleteCategory(id: string) {
  return await prisma.category.delete({
    where: {
      id: id,
    },
  });
}