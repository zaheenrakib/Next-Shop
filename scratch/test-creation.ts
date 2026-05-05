
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing Attribute Creation...');
    const attr = await prisma.attribute.create({
      data: { name: 'Test Attribute ' + Date.now() }
    });
    console.log('Attribute Created:', attr);

    console.log('Testing Category Creation...');
    const cat = await prisma.category.create({
      data: { name: 'Test Category ' + Date.now() }
    });
    console.log('Category Created:', cat);
  } catch (error) {
    console.error('Operation failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
