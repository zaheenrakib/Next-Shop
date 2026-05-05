import mongoose, { Schema, Document } from 'mongoose';

export interface ICategoryAttribute extends Document {
  category: mongoose.Types.ObjectId;
  attribute: mongoose.Types.ObjectId;
}

const CategoryAttributeSchema: Schema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  attribute: { type: Schema.Types.ObjectId, ref: 'Attribute', required: true },
}, { timestamps: true });

CategoryAttributeSchema.index({ category: 1, attribute: 1 }, { unique: true });

export default mongoose.models.CategoryAttribute || mongoose.model<ICategoryAttribute>('CategoryAttribute', CategoryAttributeSchema);
