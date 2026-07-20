import { Schema, models, model } from "mongoose";

const SettingsSchema = new Schema(
  {
    // Singleton document — always looked up with { key: "site" }
    key: { type: String, required: true, unique: true, default: "site" },
    shippingDomicile: { type: Number, required: true, default: 600 },
    shippingBureau: { type: Number, required: true, default: 400 },
    freeShippingThreshold: { type: Number, default: 0 }, // 0 = disabled
  },
  { timestamps: true }
);

export default models.Settings || model("Settings", SettingsSchema);
