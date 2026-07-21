import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { isAdminAuthenticated } from "@/lib/auth";


export async function GET() {
  await connectDB();

  const categories = await Category.find().sort({
    order: 1,
  });

  return NextResponse.json({
    categories,
  });
}


export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  await connectDB();

  const body = await req.json();

  try {
    const category = await Category.create(body);

    return NextResponse.json(
      { category },
      { status: 201 }
    );

  } catch (err: unknown) {

    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      err.code === 11000
    ) {
      return NextResponse.json(
        { error: "Cette catégorie existe déjà" },
        { status: 409 }
      );
    }


    return NextResponse.json(
      { error: "Erreur création catégorie" },
      { status: 500 }
    );
  }
}