import { Schema, model, models, type Document } from "mongoose";

export type ListingStatus = "pending" | "approved" | "rejected";
export type PackageTier = "verify" | "trading" | "features" | null;

export interface IListing extends Document {
  owner: Schema.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  category: string;
  subcategory: string;
  location: string;
  country?: string;
  address?: string;
  bannerImage?: string;
  photos: string[];
  images: string[];
  price?: number;
  priceFrom?: number;
  currency?: string;
  amenities: string[];
  tags: string[];
  highlights: string[];
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
  socialLinks: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    x?: string;
  };
  googleMapsLink?: string;
  status: ListingStatus;
  views: number;
  whatsappClicks: number;
  phoneClicks: number;
  featured: boolean;
  ratingAverage: number;
  reviewCount: number;
  businessHours?: string;
  whatsapp?: string;
  website?: string;
  checkIn?: string;
  checkOut?: string;
  menuLink?: string;
  tips?: string;
  eventDate?: string;
  eventTime?: string;
  bookingLink?: string;
  transportType?: string;
  package?: PackageTier;
  packageExpiryDate?: Date;
  packagePurchaseDate?: Date;
  verified: boolean;
  verificationPending: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema = new Schema<IListing>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    location: { type: String, required: true, index: true },
    country: { type: String, index: true },
    address: { type: String },
    bannerImage: { type: String },
    photos: { type: [String], default: [] },
    images: [{ type: String, required: true }],
    price: { type: Number },
    priceFrom: { type: Number },
    currency: { type: String, default: "USD" },
    amenities: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    highlights: { type: [String], default: [] },
    contactInfo: {
      phone: String,
      email: String,
      website: String
    },
    socialLinks: {
      facebook: String,
      instagram: String,
      tiktok: String,
      x: String
    },
    googleMapsLink: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true
    },
    views: { type: Number, default: 0 },
    whatsappClicks: { type: Number, default: 0 },
    phoneClicks: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    ratingAverage: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    businessHours: { type: String },
    whatsapp: { type: String },
    website: { type: String },
    checkIn: { type: String },
    checkOut: { type: String },
    menuLink: { type: String },
    tips: { type: String },
    eventDate: { type: String },
    eventTime: { type: String },
    bookingLink: { type: String },
    transportType: { type: String },
    package: {
      type: String,
      enum: ["verify", "trading", "features"],
      default: null
    },
    packageExpiryDate: { type: Date },
    packagePurchaseDate: { type: Date },
    verified: { type: Boolean, default: false, index: true },
    verificationPending: { type: Boolean, default: false }
  },
  { timestamps: true }
);

ListingSchema.index({
  title: "text",
  description: "text",
  location: "text",
  country: "text",
  category: "text",
  subcategory: "text",
  tags: "text",
  amenities: "text"
});

export default models.Listing || model<IListing>("Listing", ListingSchema);
