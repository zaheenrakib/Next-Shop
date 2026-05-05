import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function createProduct(productData: any, variants: any[]) {
  const slug = productData.name.toLowerCase().split(' ').join('-') + '-' + Date.now();
  
  // Use Prisma transaction or nested writes
  return await prisma.product.create({
    data: {
      name: productData.name,
      slug,
      description: productData.description,
      thumbnail: productData.thumbnail,
      status: productData.status || 'draft',
      brand: { connect: { id: productData.brandId } },
      category: { connect: { id: productData.categoryId } },
      variants: {
        create: variants.map((vData) => ({
          sku: vData.sku || `SKU-${productData.name.substring(0, 3).toUpperCase()}-${uuidv4().substring(0, 8).toUpperCase()}`,
          price: vData.price,
          stock: vData.stock,
          image: vData.image || productData.thumbnail,
          variantAttributes: {
            create: (vData.attributeValues || []).map((attrValueId: string) => ({
              attributeValue: { connect: { id: attrValueId } }
            }))
          }
        }))
      }
    },
    include: {
      variants: {
        include: {
          variantAttributes: {
            include: {
              attributeValue: {
                include: {
                  attribute: true
                }
              }
            }
          }
        }
      }
    }
  });
}

export async function getProducts(filters: any = {}, pagination: any = { page: 1, limit: 10 }) {
  const { categoryId, brandId, search } = filters;
  const skip = (pagination.page - 1) * pagination.limit;

  const where: any = {};
  if (categoryId) where.categoryId = categoryId;
  if (brandId) where.brandId = brandId;
  if (search) where.name = { contains: search, mode: 'insensitive' };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        brand: true,
        category: true,
        variants: true
      },
      skip,
      take: pagination.limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.product.count({ where })
  ]);

  return {
    products,
    total,
    pages: Math.ceil(total / pagination.limit),
    currentPage: pagination.page
  };
}

export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      brand: true,
      category: true,
      variants: {
        include: {
          variantAttributes: {
            include: {
              attributeValue: {
                include: {
                  attribute: true
                }
              }
            }
          }
        }
      }
    }
  });
}

export async function getProductBySlug(slug: string) {
  return await prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      category: true,
      variants: {
        include: {
          variantAttributes: {
            include: {
              attributeValue: {
                include: {
                  attribute: true
                }
              }
            }
          }
        }
      }
    }
  });
}
