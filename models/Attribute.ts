import mongoose, { Schema, Document } from 'mongoose';

export interface IAttribute extends Document {
  name: string;
}

const AttributeSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.models.Attribute || mongoose.model<IAttribute>('Attribute', AttributeSchema);
