import { Schema, model, models, type Document } from "mongoose";

export interface IReport extends Document {
  listing: Schema.Types.ObjectId;
  reporter: Schema.Types.ObjectId;
  reason: string;
  status: "pending" | "reviewed" | "resolved";
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
    reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["pending", "reviewed", "resolved"], 
      default: "pending" 
    }
  },
  { timestamps: true }
);

export default models.Report || model<IReport>("Report", ReportSchema);
