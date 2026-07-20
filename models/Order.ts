import { Schema, models, model } from "mongoose";

const OrderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const CustomerSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    commune: { type: String, required: true },
    wilaya: { type: String, required: true },
    postalCode: { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: { type: CustomerSchema, required: true },
    items: [OrderItemSchema],
    deliveryMethod: {
      type: String,
      enum: ["domicile", "bureau"],
      required: true,
    },
    notes: { type: String, default: "" },
    subtotal: { type: Number, required: true },
    shippingEstimate: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: { type: String, enum: ["cod"], default: "cod" },
  },
  { timestamps: true }
);

export default models.Order || model("Order", OrderSchema);
