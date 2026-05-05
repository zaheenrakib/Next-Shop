import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  brand: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  description: string;
  thumbnail: string;
  status: 'draft' | 'active' | 'archived';
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String },
  thumbnail: { type: String },
  status: { type: String, enum: ['draft', 'active', 'archived'], default: 'draft' },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
