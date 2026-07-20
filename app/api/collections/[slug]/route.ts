import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Collection from "@/models/Collection";
import Product from "@/models/Product";
import { deleteImage } from "@/lib/cloudinary";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  await connectDB();
  const { slug } = await params;
  const collection = await Collection.findOne({ slug });
  if (!collection) {
    return NextResponse.json({ error: "Catégorie introuvable" }, { status: 404 });
  }
  return NextResponse.json({ collection });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  await connectDB();
  const { slug } = await params;
  const body = await req.json();
  const collection = await Collection.findOneAndUpdate({ slug }, body, { new: true });
  if (!collection) {
    return NextResponse.json({ error: "Catégorie introuvable" }, { status: 404 });
  }
  return NextResponse.json({ collection });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  await connectDB();
  const { slug } = await params;

  const inUse = await Product.countDocuments({ collectionSlug: slug });
  if (inUse > 0) {
    return NextResponse.json(
      { error: `${inUse} produit(s) utilisent encore cette catégorie` },
      { status: 409 }
    );
  }

  const collection = await Collection.findOneAndDelete({ slug });
  if (!collection) {
    return NextResponse.json({ error: "Catégorie introuvable" }, { status: 404 });
  }
  if (collection.coverImage?.publicId) {
    await deleteImage(collection.coverImage.publicId);
  }
  return NextResponse.json({ ok: true });
}
