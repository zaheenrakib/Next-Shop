import mongoose, { Schema, Document } from 'mongoose';

export interface IVariant extends Document {
  product: mongoose.Types.ObjectId;
  sku: string;
  price: number;
  stock: number;
  image: string;
}

const VariantSchema: Schema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  image: { type: String },
}, { timestamps: true });

export default mongoose.models.Variant || mongoose.model<IVariant>('Variant', VariantSchema);
