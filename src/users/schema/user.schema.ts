import { Schema, Document } from 'mongoose';

export type UserDocument = Document & {
  email: string;
  passwordHash: string;
  name: string;
};

export const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true, minlength: 8, maxlength: 15 },
  name: { type: String, required: true },
});
