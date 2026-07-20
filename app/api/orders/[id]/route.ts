import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { isAdminAuthenticated } from "@/lib/auth";

const VALID_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  await connectDB();
  const { id } = await params;
  const order = await Order.findById(id);
  if (!order) return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  await connectDB();
  const { id } = await params;
  const { status } = await req.json();

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const order = await Order.findById(id);
  if (!order) return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });

  const wasCancelled = order.status === "cancelled";
  const isNowCancelled = status === "cancelled";

  // Restock items if an order is cancelled after being placed; reverse that
  // if a cancelled order is somehow un-cancelled.
  if (isNowCancelled && !wasCancelled) {
    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.productId, "sizes.size": item.size },
        { $inc: { "sizes.$.stock": item.quantity } }
      );
    }
  } else if (!isNowCancelled && wasCancelled) {
    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.productId, "sizes.size": item.size },
        { $inc: { "sizes.$.stock": -item.quantity } }
      );
    }
  }

  order.status = status;
  await order.save();

  return NextResponse.json({ order });
}
