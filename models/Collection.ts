import { Schema, models, model } from "mongoose";

const CollectionSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    coverImage: {
      url: String,
      publicId: String,
      alt: String,
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Collection || model("Collection", CollectionSchema);
