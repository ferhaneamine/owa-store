import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Settings from "@/models/Settings";
import { isAdminAuthenticated } from "@/lib/auth";

async function getOrCreateSettings() {
  let settings = await Settings.findOne({ key: "site" });
  if (!settings) {
    settings = await Settings.create({ key: "site" });
  }
  return settings;
}

// Public — checkout/cart need this to compute shipping without requiring auth.
export async function GET() {
  await connectDB();
  const settings = await getOrCreateSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  await connectDB();
  const body = await req.json();
  const allowed = ["shippingDomicile", "shippingBureau", "freeShippingThreshold"];
  const update: Record<string, number> = {};
  for (const key of allowed) {
    if (typeof body[key] === "number" && body[key] >= 0) update[key] = body[key];
  }
  const settings = await Settings.findOneAndUpdate(
    { key: "site" },
    update,
    { new: true, upsert: true }
  );
  return NextResponse.json({ settings });
}
