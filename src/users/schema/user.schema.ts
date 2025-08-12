import { Schema, Document } from 'mongoose';

export type Address = {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
};

export type UserDocument = Document & {
  email: string;
  password: string;
  name: string;
  gender?: string;
  address?: Address;
  phone?: string;
  authProvider: 'local' | 'google' | 'github' | 'facebook';
};

export const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () {
      return this.authProvider === 'local';
    },
    minlength: 8,
    maxlength: 100,
  },
  name: { type: String, required: true },
  gender: { type: String, required: false },
  authProvider: {
    type: String,
    enum: ['local', 'google', 'github', 'facebook'],
    default: 'local',
  },
  address: {
    street: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    postalCode: { type: String, required: false },
  },
  phone: { type: String, required: false },
});
