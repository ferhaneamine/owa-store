import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Collection from "@/models/Collection";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const collections = await Collection.find().sort({ order: 1 });
  return NextResponse.json({ collections });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  await connectDB();
  const body = await req.json();
  try {
    const collection = await Collection.create(body);
    return NextResponse.json({ collection }, { status: 201 });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && err.code === 11000) {
      return NextResponse.json(
        { error: "Une catégorie avec ce slug existe déjà" },
        { status: 409 }
      );
    }
    console.error("Collection creation failed", err);
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
  }
}
