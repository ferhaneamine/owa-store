import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { isAdminAuthenticated } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  await connectDB();

  const { slug } = await params;

  const category = await Category.findOneAndDelete({
    slug,
  });

  if (!category) {
    return NextResponse.json(
      { error: "Catégorie introuvable" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}