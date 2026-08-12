import { Schema, model, models, Document } from 'mongoose';

export interface IPermission extends Document {
  key: string;
  label: string;
  description: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const permissionSchema = new Schema<IPermission>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PermissionModel =
  models.Permission || model<IPermission>('Permission', permissionSchema);
