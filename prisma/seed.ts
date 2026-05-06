import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Clear existing data
  await prisma.variantAttribute.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.productSpecification.deleteMany();
  await prisma.product.deleteMany();
  await prisma.categoryAttribute.deleteMany();
  await prisma.attributeValue.deleteMany();
  await prisma.attribute.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();

  // 2. Create Brands
  const apple = await prisma.brand.create({ data: { name: 'Apple' } });
  const samsung = await prisma.brand.create({ data: { name: 'Samsung' } });
  const lg = await prisma.brand.create({ data: { name: 'LG' } });
  const dell = await prisma.brand.create({ data: { name: 'Dell' } });

  // 3. Create Categories
  const mobileCat = await prisma.category.create({ data: { name: 'Mobile' } });
  const laptopCat = await prisma.category.create({ data: { name: 'Laptop' } });
  const washingMachineCat = await prisma.category.create({ data: { name: 'Washing Machine' } });

  // 4. Create Attributes
  const ramAttr = await prisma.attribute.create({ data: { name: 'RAM', type: 'select' } });
  const storageAttr = await prisma.attribute.create({ data: { name: 'Storage', type: 'select' } });
  const colorAttr = await prisma.attribute.create({ data: { name: 'Color', type: 'select' } });
  const cpuAttr = await prisma.attribute.create({ data: { name: 'CPU', type: 'text' } });
  const batteryAttr = await prisma.attribute.create({ data: { name: 'Battery', type: 'number' } });
  const capacityAttr = await prisma.attribute.create({ data: { name: 'Capacity', type: 'number' } });
  const loadTypeAttr = await prisma.attribute.create({ data: { name: 'Load Type', type: 'select' } });

  // 5. Create Attribute Values
  await prisma.attributeValue.createMany({
    data: [
      { attributeId: ramAttr.id, value: '8GB' },
      { attributeId: ramAttr.id, value: '16GB' },
      { attributeId: ramAttr.id, value: '32GB' },
      { attributeId: storageAttr.id, value: '256GB' },
      { attributeId: storageAttr.id, value: '512GB' },
      { attributeId: storageAttr.id, value: '1TB' },
      { attributeId: colorAttr.id, value: 'Space Gray' },
      { attributeId: colorAttr.id, value: 'Silver' },
      { attributeId: colorAttr.id, value: 'Black' },
      { attributeId: loadTypeAttr.id, value: 'Front Load' },
      { attributeId: loadTypeAttr.id, value: 'Top Load' },
    ],
  });

  // 6. Link Attributes to Categories
  await prisma.categoryAttribute.createMany({
    data: [
      // Mobile
      { categoryId: mobileCat.id, attributeId: ramAttr.id },
      { categoryId: mobileCat.id, attributeId: storageAttr.id },
      { categoryId: mobileCat.id, attributeId: colorAttr.id },
      { categoryId: mobileCat.id, attributeId: batteryAttr.id },
      // Laptop
      { categoryId: laptopCat.id, attributeId: ramAttr.id },
      { categoryId: laptopCat.id, attributeId: storageAttr.id },
      { categoryId: laptopCat.id, attributeId: cpuAttr.id },
      // Washing Machine
      { categoryId: washingMachineCat.id, attributeId: capacityAttr.id },
      { categoryId: washingMachineCat.id, attributeId: loadTypeAttr.id },
    ],
  });

  // 7. Create Demo Products
  
  // -- iPhone 15 Pro --
  const iphone = await prisma.product.create({
    data: {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'The latest iPhone with Titanium design.',
      brandId: apple.id,
      categoryId: mobileCat.id,
      status: 'active',
      specifications: {
        create: [
          { attributeId: batteryAttr.id, value: '3274' },
        ],
      },
    },
  });

  // Fetch created values for variants
  const ram8gb = await prisma.attributeValue.findFirst({ where: { value: '8GB', attributeId: ramAttr.id } });
  const storage256gb = await prisma.attributeValue.findFirst({ where: { value: '256GB', attributeId: storageAttr.id } });
  const storage512gb = await prisma.attributeValue.findFirst({ where: { value: '512GB', attributeId: storageAttr.id } });
  const spaceGray = await prisma.attributeValue.findFirst({ where: { value: 'Space Gray', attributeId: colorAttr.id } });

  if (ram8gb && storage256gb && spaceGray) {
    await prisma.variant.create({
      data: {
        productId: iphone.id,
        sku: 'IP15P-256-SG',
        price: 999,
        stock: 50,
        variantAttributes: {
          create: [
            { attributeValueId: storage256gb.id },
            { attributeValueId: spaceGray.id },
          ],
        },
      },
    });
  }

  // -- Dell XPS 15 --
  const dellXps = await prisma.product.create({
    data: {
      name: 'Dell XPS 15',
      slug: 'dell-xps-15',
      description: 'High performance laptop for creators.',
      brandId: dell.id,
      categoryId: laptopCat.id,
      status: 'active',
      specifications: {
        create: [
          { attributeId: cpuAttr.id, value: 'Intel Core i9-13900H' },
        ],
      },
    },
  });

  // -- Samsung Front Load Washer --
  const samsungWasher = await prisma.product.create({
    data: {
      name: 'Samsung 9kg Front Load',
      slug: 'samsung-9kg-washer',
      description: 'EcoBubble technology for powerful cleaning.',
      brandId: samsung.id,
      categoryId: washingMachineCat.id,
      status: 'active',
      specifications: {
        create: [
          { attributeId: capacityAttr.id, value: '9' },
          { attributeId: loadTypeAttr.id, value: 'Front Load' },
        ],
      },
    },
  });

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
