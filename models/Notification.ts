import { Schema, model, models, type Document } from "mongoose";

export type NotificationType = "order" | "reservation" | "listing_approved";

/**
 * An in-app notification for one account — today, the "new order / new reservation"
 * ping a business owner gets the moment a customer's WhatsApp message is sent. The
 * header bell counts the unread ones and the dashboard lists them.
 */
export interface INotification extends Document {
  user: Schema.Types.ObjectId;
  type: NotificationType;
  title: string;
  body?: string;
  listing?: Schema.Types.ObjectId;
  listingTitle?: string;
  /** Where clicking the notification should take the account. */
  href?: string;
  read: boolean;
  meta?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["order", "reservation", "listing_approved"], required: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, trim: true },
    listing: { type: Schema.Types.ObjectId, ref: "Listing" },
    listingTitle: { type: String, trim: true },
    href: { type: String, trim: true },
    read: { type: Boolean, default: false, index: true },
    meta: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

NotificationSchema.index({ user: 1, read: 1, createdAt: -1 });

export default models.Notification || model<INotification>("Notification", NotificationSchema);
