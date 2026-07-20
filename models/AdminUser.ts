import { Schema, models, model } from "mongoose";

const AdminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["owner", "staff"], default: "staff" },
  },
  { timestamps: true }
);

export default models.AdminUser || model("AdminUser", AdminUserSchema);
