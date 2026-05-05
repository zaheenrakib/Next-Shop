import mongoose, { Schema, Document } from 'mongoose';

export interface IAttributeValue extends Document {
  attribute: mongoose.Types.ObjectId;
  value: string;
}

const AttributeValueSchema: Schema = new Schema({
  attribute: { type: Schema.Types.ObjectId, ref: 'Attribute', required: true },
  value: { type: String, required: true },
}, { timestamps: true });

// Ensure unique value per attribute
AttributeValueSchema.index({ attribute: 1, value: 1 }, { unique: true });

export default mongoose.models.AttributeValue || mongoose.model<IAttributeValue>('AttributeValue', AttributeValueSchema);
