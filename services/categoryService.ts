
import prisma from '@/lib/prisma';

export async function createCategory(data: { 
  name: string; 
  slug?: string;
  parentId?: string | null; 
  image?: string;
  icon?: string;
  isActive?: boolean;
  sortOrder?: number;
}) {
  const slug = data.slug || data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  
  // Check if category with same name or slug already exists
  const existing = await prisma.category.findFirst({
    where: {
      OR: [
        { name: data.name },
        { slug: slug }
      ]
    }
  });

  if (existing) {
    throw new Error(`Category with name "${data.name}" or slug "${slug}" already exists.`);
  }

  return await prisma.category.create({
    data: {
      name: data.name,
      slug: slug,
      parentId: (data.parentId === 'none' || !data.parentId) ? null : data.parentId,
      image: data.image,
      icon: data.icon,
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export async function updateCategory(id: string, data: { 
  name?: string; 
  slug?: string;
  parentId?: string | null; 
  image?: string;
  icon?: string;
  isActive?: boolean;
  sortOrder?: number;
}) {
  return await prisma.category.update({
    where: { id },
    data: {
      ...data,
      parentId: data.parentId === 'none' ? null : data.parentId,
    },
  });
}

export async function getCategories() {
  return await prisma.category.findMany({
    include: {
      parent: true,
    },
    orderBy: {
      sortOrder: 'asc'
    }
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