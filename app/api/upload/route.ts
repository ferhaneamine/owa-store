import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { isAdminAuthenticated } from "@/lib/auth";

// Expects { fileBase64: "data:image/jpeg;base64,..." }
export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const { fileBase64 } = await req.json();
    if (!fileBase64) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }
    const result = await uploadImage(fileBase64);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("Upload failed", err);
    return NextResponse.json({ error: "Échec de l'upload" }, { status: 500 });
  }
}
