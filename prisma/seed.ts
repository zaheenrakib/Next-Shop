import { PrismaClient, ProductStatus, AttributeType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Cleanup existing data
  await prisma.inventoryTransaction.deleteMany();
  await prisma.variantImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productVariantAttribute.deleteMany();
  await prisma.product.deleteMany();
  await prisma.variantOption.deleteMany();
  await prisma.variantAttribute.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  // await prisma.user.deleteMany({ where: { role: 'VENDOR' } });

  // 3. Create Brands
  const apple = await prisma.brand.create({ data: { name: 'Apple' } });
  const samsung = await prisma.brand.create({ data: { name: 'Samsung' } });
  const dell = await prisma.brand.create({ data: { name: 'Dell' } });

  // 4. Create Categories
  const mobileCat = await prisma.category.create({ 
    data: { name: 'Mobile', slug: 'mobile', isActive: true } 
  });
  const laptopCat = await prisma.category.create({ 
    data: { name: 'Laptop', slug: 'laptop', isActive: true } 
  });

  // 5. Create Attributes
  const ramAttr = await prisma.variantAttribute.create({ 
    data: { name: 'RAM', displayName: 'System Memory', type: 'SELECT', isGlobal: true } 
  });
  const colorAttr = await prisma.variantAttribute.create({ 
    data: { name: 'Color', displayName: 'Product Color', type: 'COLOR_SWATCH', isGlobal: true } 
  });

  // 6. Create Options
  await prisma.variantOption.createMany({
    data: [
      { attributeId: ramAttr.id, value: '8GB', sortOrder: 1 },
      { attributeId: ramAttr.id, value: '16GB', sortOrder: 2 },
      { attributeId: colorAttr.id, value: 'Space Gray', colorCode: '#535353', sortOrder: 1 },
      { attributeId: colorAttr.id, value: 'Silver', colorCode: '#C0C0C0', sortOrder: 2 },
    ]
  });

  // 7. Create Products
  const iphone = await prisma.product.create({
    data: {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      shortDescription: 'Titanium design, A17 Pro chip.',
      longDescription: 'The latest iPhone 15 Pro features a strong and light aerospace-grade titanium design.',
      categoryId: mobileCat.id,
      brandId: apple.id,
      status: 'ACTIVE',
      basePrice: 999,
      stockQuantity: 100,
      sku: 'IP15P-BASE',
      isFeatured: true,
      metaTitle: 'Buy iPhone 15 Pro - Best Price',
      metaDescription: 'Get the latest iPhone 15 Pro with Titanium design and A17 Pro chip.',
      thumbnail: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=1000&auto=format&fit=crop"
    }
  });

  // 8. Create Product Variant
  const grayOption = await prisma.variantOption.findFirst({ where: { value: 'Space Gray' } });
  
  if (grayOption) {
    await prisma.productVariant.create({
      data: {
        productId: iphone.id,
        sku: 'IP15P-256-SG',
        combination: { color: 'Space Gray', storage: '256GB' },
        combinationHash: 'hash_sg_256',
        price: 1099,
        stockQuantity: 50,
        isActive: true,
      }
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
