import { Schema, model, Document, Types } from 'mongoose';

export interface INote extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  input: string;
  inputType: 'url' | 'topic';
  title: string;
  content: string;
  createdAt: Date;
}

const noteSchema = new Schema<INote>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  input: { type: String, required: true },
  inputType: { type: String, enum: ['url', 'topic'], required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: true },
});

noteSchema.index({ userId: 1, createdAt: -1 });

export const Note = model<INote>('Note', noteSchema);
