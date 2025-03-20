import { Schema, Document } from 'mongoose';

export type UserDocument = Document & {
  email: string;
  password: string;
  name: string;
};

export const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8, maxlength: 100 },
  name: { type: String, required: true },
});
