import { Schema, model, models, type Document } from "mongoose";

export type ReservationStatus = "pending" | "confirmed" | "declined" | "cancelled";

/**
 * A booking request for any "rezervim" business — a table, a haircut slot, a
 * dentist visit, a rental car. One shape covers every category: the fields
 * that don't apply to a given business (partySize for a dentist, time for a
 * multi-day car rental) are simply left empty.
 */
export interface IReservation extends Document {
  listing: Schema.Types.ObjectId;
  /** Which room/service was booked, when the listing has a catalog. */
  product?: Schema.Types.ObjectId;
  /** Snapshot of the product name so the row still reads if the product is later removed. */
  itemName?: string;
  /** Logged-in customer, when there is one — guests can book without an account. */
  user?: Schema.Types.ObjectId;
  customerName: string;
  customerPhone: string;
  date: Date;
  /** Check-out date for stays; omitted for a single-slot booking. */
  endDate?: Date;
  time?: string;
  partySize?: number;
  notes?: string;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema = new Schema<IReservation>(
  {
    listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    itemName: { type: String, trim: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    endDate: { type: Date },
    time: { type: String, trim: true },
    partySize: { type: Number, min: 1 },
    notes: { type: String, trim: true },
    status: { type: String, enum: ["pending", "confirmed", "declined", "cancelled"], default: "pending", index: true }
  },
  { timestamps: true }
);

ReservationSchema.index({ listing: 1, createdAt: -1 });

export default models.Reservation || model<IReservation>("Reservation", ReservationSchema);
