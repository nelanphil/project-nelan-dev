import { Schema, model, models, Document } from 'mongoose';

export interface IContactMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
}

const contactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const ContactMessageModel =
  models.ContactMessage || model<IContactMessage>('ContactMessage', contactMessageSchema);






