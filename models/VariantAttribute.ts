import mongoose, { Schema, Document } from 'mongoose';

export interface IVariantAttribute extends Document {
  variant: mongoose.Types.ObjectId;
  attributeValue: mongoose.Types.ObjectId;
}

const VariantAttributeSchema: Schema = new Schema({
  variant: { type: Schema.Types.ObjectId, ref: 'Variant', required: true },
  attributeValue: { type: Schema.Types.ObjectId, ref: 'AttributeValue', required: true },
}, { timestamps: true });

// Ensure unique attribute value per variant
VariantAttributeSchema.index({ variant: 1, attributeValue: 1 }, { unique: true });

export default mongoose.models.VariantAttribute || mongoose.model<IVariantAttribute>('VariantAttribute', VariantAttributeSchema);
