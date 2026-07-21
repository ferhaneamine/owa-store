import mongoose, { Schema, models, model } from "mongoose";

const ProductImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    alt: { type: String, default: "" },
  },
  { _id: false }
);

const VariantStockSchema = new Schema(
  {
    size: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: false }
);

const ProductSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number },

    // Optional description
    description: { type: String, default: "" },

    // Keep category
    category: {
      type: String,
      enum: ["hoodie", "tshirt", "pants", "accessory"],
      required: true,
    },

    // Removed collectionSlug

    colors: [{ type: String }],
    sizes: [VariantStockSchema],
    images: [ProductImageSchema],

    featured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text", tags: "text" });

export default models.Product || model("Product", ProductSchema);