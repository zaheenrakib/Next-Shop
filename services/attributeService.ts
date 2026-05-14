import prisma from '@/lib/prisma';
import { AttributeType } from '@prisma/client';

export async function createAttribute(data: { 
  name: string; 
  displayName?: string; 
  type?: AttributeType; 
  isGlobal?: boolean 
}) {
  return await prisma.variantAttribute.create({
    data: {
      name: data.name,
      displayName: data.displayName,
      type: data.type || 'SELECT',
      isGlobal: data.isGlobal ?? true,
    },
  });
}

export async function getAttributes() {
  return await prisma.variantAttribute.findMany({
    include: {
      options: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function updateAttribute(id: string, data: any) {
  return await prisma.variantAttribute.update({
    where: { id },
    data,
  });
}

export async function deleteAttribute(id: string) {
  return await prisma.variantAttribute.delete({
    where: { id },
  });
}

export async function createAttributeValue(data: { 
  attributeId: string; 
  value: string; 
  colorCode?: string; 
  imageUrl?: string; 
  sortOrder?: number 
}) {
  return await prisma.variantOption.create({
    data: {
      attributeId: data.attributeId,
      value: data.value,
      colorCode: data.colorCode,
      imageUrl: data.imageUrl,
      sortOrder: data.sortOrder || 0,
    },
  });
}

export async function getAttributeValues(attributeId?: string) {
  return await prisma.variantOption.findMany({
    where: attributeId ? { attributeId } : {},
    include: {
      attribute: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  });
}

export async function updateAttributeValue(id: string, data: any) {
  return await prisma.variantOption.update({
    where: { id },
    data,
  });
}

export async function deleteAttributeValue(id: string) {
  return await prisma.variantOption.delete({
    where: { id },
  });
}
