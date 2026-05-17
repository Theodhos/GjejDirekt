import { Schema, model, models, type Document } from "mongoose";

export interface IHiddenCity extends Document {
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

const HiddenCitySchema = new Schema<IHiddenCity>(
  {
    value: { type: String, required: true, unique: true, index: true }
  },
  { timestamps: true }
);

export default models.HiddenCity || model<IHiddenCity>("HiddenCity", HiddenCitySchema);
