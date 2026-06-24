import { Schema, model, models, type Document } from "mongoose";

export type ActivityType =
  | "user_registered"
  | "user_logged_in"
  | "profile_updated"
  | "listing_submitted"
  | "listing_approved"
  | "listing_rejected"
  | "listing_deleted"
  | "review_created"
  | "blog_created"
  | "blog_updated";

export interface IActivity extends Document {
  type: ActivityType;
  title: string;
  description?: string;
  actor?: Schema.Types.ObjectId;
  actorName?: string;
  listing?: Schema.Types.ObjectId;
  listingTitle?: string;
  meta?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    type: {
      type: String,
      enum: [
        "user_registered",
        "user_logged_in",
        "profile_updated",
        "listing_submitted",
        "listing_approved",
        "listing_rejected",
        "listing_deleted",
        "review_created",
        "blog_created",
        "blog_updated"
      ],
      required: true,
      index: true
    },
    title: { type: String, required: true },
    description: { type: String },
    actor: { type: Schema.Types.ObjectId, ref: "User" },
    actorName: { type: String },
    listing: { type: Schema.Types.ObjectId, ref: "Listing" },
    listingTitle: { type: String },
    meta: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

ActivitySchema.index({ createdAt: -1 });

export default models.Activity || model<IActivity>("Activity", ActivitySchema);
