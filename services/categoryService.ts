import Category from '@/models/Category';
import connectDB from '@/lib/db';

export async function createCategory(data: { name: string; parent?: string }) {
  await connectDB();
  const category = new Category(data);
  return await category.save();
}

export async function getCategories() {
  await connectDB();
  return await Category.find().populate('parent');
}

export async function getCategoryTree() {
  await connectDB();
  const categories = await Category.find().lean();
  
  const buildTree = (parentId: string | null = null): any[] => {
    return categories
      .filter(cat => String(cat.parent || null) === String(parentId || null))
      .map(cat => ({
        ...cat,
        children: buildTree(cat._id.toString())
      }));
  };

  return buildTree(null);
}
