import prisma from '@/lib/prisma';

export async function createAttribute(name: string) {
  return await prisma.attribute.create({
    data: { name },
  });
}

export async function getAttributes() {
  return await prisma.attribute.findMany();
}

export async function createAttributeValue(attributeId: string, value: string) {
  return await prisma.attributeValue.create({
    data: {
      attributeId,
      value,
    },
  });
}

export async function getAttributeValues(attributeId?: string) {
  return await prisma.attributeValue.findMany({
    where: attributeId ? { attributeId } : {},
    include: {
      attribute: true,
    },
  });
}
