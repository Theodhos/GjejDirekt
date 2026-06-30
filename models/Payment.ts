import { Schema, model, models, type Document } from "mongoose";

export type PaymentVerificationStatus = "none" | "pending" | "approved";

export interface IPayment extends Document {
  user: Schema.Types.ObjectId;
  userName: string;
  userEmail: string;
  listing?: Schema.Types.ObjectId;
  listingTitle?: string;
  packet: string;
  packageName: string;
  amount: number;
  currency: string;
  orderID?: string;
  verificationStatus: PaymentVerificationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    userName: { type: String, default: "" },
    userEmail: { type: String, default: "" },
    listing: { type: Schema.Types.ObjectId, ref: "Listing" },
    listingTitle: { type: String },
    packet: { type: String, required: true },
    packageName: { type: String, default: "" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "EUR" },
    orderID: { type: String },
    verificationStatus: {
      type: String,
      enum: ["none", "pending", "approved"],
      default: "none",
      index: true
    }
  },
  { timestamps: true }
);

export default models.Payment || model<IPayment>("Payment", PaymentSchema);
