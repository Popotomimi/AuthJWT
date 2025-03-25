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
};

export const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8, maxlength: 100 },
  name: { type: String, required: true },
  gender: { type: String, required: false },
  address: {
    street: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    postalCode: { type: String, required: false },
  },
  phone: { type: String, required: false },
});
