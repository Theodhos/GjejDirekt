import { Schema, model, models, type Document } from "mongoose";

export type UserRole = "user" | "admin";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  avatar?: string;
  provider?: string;
  resetCode?: string;
  resetCodeExpires?: Date;
  role: UserRole;
  favorites: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, sparse: true },
    avatar: { type: String },
    provider: { type: String, default: "email" },
    resetCode: { type: String },
    resetCodeExpires: { type: Date },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Listing" }]
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", UserSchema);
