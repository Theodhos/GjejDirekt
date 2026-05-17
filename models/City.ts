import { Schema, model, models, type Document } from "mongoose";

export interface ICity extends Document {
  value: string;
  label: string;
  region: string;
  description: string;
  image: string;
  country: "Albania" | "North Macedonia";
  villages: string[];
  source: "admin";
  createdAt: Date;
  updatedAt: Date;
}

const CitySchema = new Schema<ICity>(
  {
    value: { type: String, required: true, unique: true, index: true },
    label: { type: String, required: true, trim: true },
    region: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    country: { type: String, enum: ["Albania", "North Macedonia"], required: true },
    villages: { type: [String], default: [] },
    source: { type: String, enum: ["admin"], default: "admin" }
  },
  { timestamps: true }
);

export default models.City || model<ICity>("City", CitySchema);

