import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Settings from "@/models/Settings";
import { isAdminAuthenticated } from "@/lib/auth";

const orderSchema = z.object({
  customer: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().min(8),
    address: z.string().min(3),
    city: z.string().min(1),
    commune: z.string().min(1),
    wilaya: z.string().min(1),
    postalCode: z.string().optional(),
  }),
  items: z
    .array(
      z.object({
        productId: z.string(),
        name: z.string(),
        price: z.number().nonnegative(),
        size: z.string(),
        color: z.string(),
        quantity: z.number().int().positive(),
        image: z.string().optional().default(""),
      })
    )
    .min(1),
  deliveryMethod: z.enum(["domicile", "bureau"]),
  notes: z.string().optional(),
});

function generateOrderNumber() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `OWA-${Date.now().toString(36).toUpperCase()}-${rand}`;
}

// Reads the admin-configured shipping prices — falls back to sane defaults
// if the settings document hasn't been created yet. Applies the free
// shipping threshold if the order subtotal qualifies.
async function getShippingPrice(deliveryMethod: "domicile" | "bureau", subtotal: number) {
  const settings = await Settings.findOne({ key: "site" });
  const domicile = settings?.shippingDomicile ?? 600;
  const bureau = settings?.shippingBureau ?? 400;
  const threshold = settings?.freeShippingThreshold ?? 0;
  if (threshold > 0 && subtotal >= threshold) return 0;
  return deliveryMethod === "domicile" ? domicile : bureau;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();

    const { customer, items, deliveryMethod, notes } = parsed.data;

    // Re-validate stock server-side — never trust client-submitted prices/stock.
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Produit introuvable: ${item.name}` },
          { status: 400 }
        );
      }
      const variant = product.sizes.find((s: { size: string }) => s.size === item.size);
      if (!variant || variant.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuffisant pour ${item.name} (${item.size})` },
          { status: 409 }
        );
      }
    }

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shippingEstimate = await getShippingPrice(deliveryMethod, subtotal);
    const total = subtotal + shippingEstimate;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customer,
      items,
      deliveryMethod,
      notes,
      subtotal,
      shippingEstimate,
      total,
      status: "pending",
      paymentMethod: "cod",
    });

    // Decrement stock
    for (const item of items) {
      await Product.updateOne(
        { _id: item.productId, "sizes.size": item.size },
        { $inc: { "sizes.$.stock": -item.quantity } }
      );
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error("Order creation failed", err);
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessayez." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  await connectDB();
  const status = req.nextUrl.searchParams.get("status");
  const query = status ? { status } : {};
  const orders = await Order.find(query).sort({ createdAt: -1 }).limit(200);
  return NextResponse.json({ orders });
}
