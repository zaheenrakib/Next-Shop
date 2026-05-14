
import prisma from '@/lib/prisma';

export async function getProducts(filters: any = {}, pagination: any = { page: 1, limit: 10 }) {
  const { categoryId, brandId, search, maxPrice } = filters;
  const skip = (pagination.page - 1) * pagination.limit;

  const where: any = {};


  if (categoryId && categoryId !== 'null' && categoryId !== '') where.categoryId = categoryId;
  if (brandId && brandId !== 'null' && brandId !== '') where.brandId = brandId;


  if (maxPrice) {
    where.price = { lte: Number(maxPrice) };
  }


  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { model: { contains: search, mode: 'insensitive' } }
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { brand: true, category: true },
      skip,
      take: pagination.limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.product.count({ where })
  ]);

  return { products, total, pages: Math.ceil(total / pagination.limit), currentPage: pagination.page };
}

export async function createProduct(productData: any, variants: any[] = []) {
  const slug = productData.name.toLowerCase().split(' ').join('-') + '-' + Date.now();

  return await prisma.product.create({
    data: {
      ...productData,
      slug,
      price: Number(productData.price),
      discountPrice: Number(productData.discountPrice),
      stock: Number(productData.stock),
      brand: { connect: { id: productData.brandId } },
      category: { connect: { id: productData.categoryId } },
      specifications: {
        create: (productData.specifications || []).map((spec: any) => ({
          attributeId: spec.attributeId,
          value: String(spec.value)
        }))
      },
      variants: {
        create: variants.map((vData) => ({
          sku: vData.sku || `SKU-${uuidv4().substring(0, 8).toUpperCase()}`,
          price: Number(vData.price),
          stock: Number(vData.stock),
          image: vData.image,
          variantAttributes: {
            create: (vData.attributeValueIds || []).map((attrValId: string) => ({
              attributeValue: { connect: { id: attrValId } }
            }))
          }
        }))
      }
    }
  });
}














































export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      brand: true,
      category: true,
      specifications: { include: { attribute: true } },
      variants: { include: { variantAttributes: { include: { attributeValue: { include: { attribute: true } } } } } }
    }
  });
}

export async function updateProduct(id: string, updateData: any) {
  return await prisma.$transaction(async (tx) => {

    await tx.productSpecification.deleteMany({ where: { productId: id } });


    return await tx.product.update({
      where: { id },
      data: {
        name: updateData.name,

        slug: updateData.name.toLowerCase().replace(/ /g, '-') + '-' + Date.now(),
        description: updateData.description,
        shortDescription: updateData.shortDescription,
        status: updateData.status,
        sku: updateData.sku,
        model: updateData.model,
        thumbnail: updateData.thumbnail,
        images: updateData.images || [],
        price: Number(updateData.price),
        discountPrice: Number(updateData.discountPrice || 0),
        stock: Number(updateData.stock),
        warranty: updateData.warranty,
        tags: updateData.tags || [],


        ...(updateData.brandId && { brand: { connect: { id: updateData.brandId } } }),
        ...(updateData.categoryId && { category: { connect: { id: updateData.categoryId } } }),


        specifications: {
          create: Object.entries(updateData.specifications || {}).map(([key, value]) => ({
            attribute: {
              connectOrCreate: {
                where: { name: key },
                create: { name: key, type: "text" }
              }
            },
            value: String(value)
          }))
        }
      }
    });
  });
}

