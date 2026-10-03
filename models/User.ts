import { Schema, model, models, type Document } from "mongoose";

export type UserRole = "user" | "admin";
/**
 * What the account is allowed to do beyond browsing and ordering/reserving — a "biznes"
 * account can list and manage a business like the platform always worked; a "klient"
 * account is a customer only and can never create a listing. Independent of `role`
 * (which only separates admins from everyone else). Defaults to "biznes" so every
 * account created before this field existed keeps exactly the access it already had.
 */
export type AccountType = "biznes" | "klient";

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
  accountType: AccountType;
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
    accountType: { type: String, enum: ["biznes", "klient"], default: "biznes" },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Listing" }]
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", UserSchema);
