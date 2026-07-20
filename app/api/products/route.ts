import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await connectDB();
  const params = req.nextUrl.searchParams;
  const category = params.get("category");
  const collectionSlug = params.get("collection");
  const q = params.get("q");
  const sort = params.get("sort") ?? "newest";

  const filter: Record<string, unknown> = {};
  if (category) filter.category = category;
  if (collectionSlug) filter.collectionSlug = collectionSlug;
  if (q) filter.$text = { $search: q };

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
  };

  const products = await Product.find(filter).sort(sortMap[sort] ?? sortMap.newest);
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  await connectDB();
  const body = await req.json();
  try {
    const product = await Product.create(body);
    return NextResponse.json({ product }, { status: 201 });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && err.code === 11000) {
      return NextResponse.json(
        { error: "Un produit avec ce slug existe déjà" },
        { status: 409 }
      );
    }
    console.error("Product creation failed", err);
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
  }
}
