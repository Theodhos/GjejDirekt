import { Schema, model, models, type Document } from "mongoose";

export interface IProduct extends Document {
  listing: Schema.Types.ObjectId;
  owner: Schema.Types.ObjectId;
  name: string;
  description: string;
  price?: number;
  image?: string;
  /** Menu section the owner grouped this item under, e.g. "Krepë të ëmbël" — free text, per listing. */
  menuCategory?: string;
  available: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true, index: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    price: { type: Number },
    image: { type: String },
    menuCategory: { type: String, trim: true },
    available: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default models.Product || model<IProduct>("Product", ProductSchema);
