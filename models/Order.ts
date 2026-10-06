import { Schema, model, models, type Document } from "mongoose";

export type OrderStatus = "new" | "confirmed" | "declined" | "cancelled";

export interface IOrderItem {
  productId?: string;
  name: string;
  price?: number;
  qty: number;
}

/**
 * A "porosi" sent to a business's WhatsApp — the server-side record of it, kept
 * alongside the chat itself (which the platform never sees). Mirrors `Reservation`
 * for bookings: one shape for every category, so a client's "Porositë" panel and
 * the admin's analytics can count orders and reservations the same way.
 */
export interface IOrder extends Document {
  listing: Schema.Types.ObjectId;
  /** Logged-in customer, when there is one — guests can order without an account. */
  user?: Schema.Types.ObjectId;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  items: IOrderItem[];
  total?: number;
  paymentMethod?: string;
  note?: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String },
    name: { type: String, required: true, trim: true },
    price: { type: Number },
    qty: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, trim: true },
    customerAddress: { type: String, trim: true },
    items: { type: [OrderItemSchema], default: [] },
    total: { type: Number },
    paymentMethod: { type: String, trim: true },
    note: { type: String, trim: true },
    status: { type: String, enum: ["new", "confirmed", "declined", "cancelled"], default: "new", index: true }
  },
  { timestamps: true }
);

OrderSchema.index({ listing: 1, createdAt: -1 });
OrderSchema.index({ user: 1, createdAt: -1 });

export default models.Order || model<IOrder>("Order", OrderSchema);
