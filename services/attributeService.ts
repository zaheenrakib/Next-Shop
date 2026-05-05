import Attribute from '@/models/Attribute';
import AttributeValue from '@/models/AttributeValue';
import connectDB from '@/lib/db';

export async function createAttribute(name: string) {
  await connectDB();
  const attribute = new Attribute({ name });
  return await attribute.save();
}

export async function getAttributes() {
  await connectDB();
  return await Attribute.find();
}

export async function createAttributeValue(attributeId: string, value: string) {
  await connectDB();
  const attributeValue = new AttributeValue({ attribute: attributeId, value });
  return await attributeValue.save();
}

export async function getAttributeValues(attributeId?: string) {
  await connectDB();
  const query = attributeId ? { attribute: attributeId } : {};
  return await AttributeValue.find(query).populate('attribute');
}
