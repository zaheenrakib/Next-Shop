import Product from '@/models/Product';
import Variant from '@/models/Variant';
import VariantAttribute from '@/models/VariantAttribute';
import Brand from '@/models/Brand';
import connectDB from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function createProduct(productData: any, variants: any[]) {
  await connectDB();
  
  // 1. Create Product
  const slug = productData.name.toLowerCase().split(' ').join('-') + '-' + Date.now();
  const product = new Product({ ...productData, slug });
  await product.save();

  // 2. Create Variants
  for (const vData of variants) {
    const sku = `SKU-${product.name.substring(0, 3).toUpperCase()}-${uuidv4().substring(0, 8).toUpperCase()}`;
    const variant = new Variant({
      product: product._id,
      sku: vData.sku || sku,
      price: vData.price,
      stock: vData.stock,
      image: vData.image || product.thumbnail
    });
    await variant.save();

    // 3. Create Variant Attributes
    if (vData.attributeValues && Array.isArray(vData.attributeValues)) {
      for (const attrValueId of vData.attributeValues) {
        const variantAttr = new VariantAttribute({
          variant: variant._id,
          attributeValue: attrValueId
        });
        await variantAttr.save();
      }
    }
  }

  return product;
}

export async function getProducts(filters: any = {}, pagination: any = { page: 1, limit: 10 }) {
  await connectDB();
  
  const { category, brand, attributes, search } = filters;
  const query: any = {};

  if (category) query.category = category;
  if (brand) query.brand = brand;
  if (search) query.name = { $regex: search, $options: 'i' };

  // Advanced attribute filtering would require aggregation or complex joining
  // For now, let's stick to basic filters and implement advanced ones in details or specific routes
  
  const skip = (pagination.page - 1) * pagination.limit;
  
  const products = await Product.find(query)
    .populate('brand')
    .populate('category')
    .skip(skip)
    .limit(pagination.limit)
    .sort({ createdAt: -1 })
    .lean();

  // Get variants for each product to show price
  const productsWithVariants = await Promise.all(products.map(async (p) => {
    const variants = await Variant.find({ product: p._id }).lean();
    return { ...p, variants };
  }));

  const total = await Product.countDocuments(query);

  return {
    products: productsWithVariants,
    total,
    pages: Math.ceil(total / pagination.limit),
    currentPage: pagination.page
  };
}

export async function getProductById(id: string) {
  await connectDB();
  const product = await Product.findById(id).populate('brand').populate('category');
  if (!product) return null;

  const variants = await Variant.find({ product: id });
  
  // Get attributes for each variant
  const variantsWithAttrs = await Promise.all(variants.map(async (v) => {
    const attrs = await VariantAttribute.find({ variant: v._id }).populate({
      path: 'attributeValue',
      populate: { path: 'attribute' }
    });
    return {
      ...v.toObject(),
      attributes: attrs.map(a => a.attributeValue)
    };
  }));

  return {
    ...product.toObject(),
    variants: variantsWithAttrs
  };
}
