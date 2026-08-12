import { Schema, model, models, Document } from 'mongoose';

export interface IEmailSettings extends Document {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  fromAddress: string;
  passwordEncrypted: string;
  createdAt: Date;
  updatedAt: Date;
}

const emailSettingsSchema = new Schema<IEmailSettings>(
  {
    host: {
      type: String,
      required: true,
      default: 'mail.privateemail.com',
      trim: true,
    },
    port: {
      type: Number,
      required: true,
      default: 587,
    },
    secure: {
      type: Boolean,
      required: true,
      default: false,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    fromAddress: {
      type: String,
      required: true,
      trim: true,
    },
    passwordEncrypted: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const EmailSettingsModel =
  models.EmailSettings || model<IEmailSettings>('EmailSettings', emailSettingsSchema);

export const DEFAULT_EMAIL_SETTINGS = {
  host: 'mail.privateemail.com',
  port: 587,
  secure: false,
};
