"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";

export interface UploadedImage {
  url: string;
  publicId: string;
  alt?: string;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageUploader({
  images,
  onChange,
  multiple = true,
  label = "Images",
}: {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  multiple?: boolean;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded: UploadedImage[] = [];
      for (const file of files) {
        const base64 = await fileToBase64(file);
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileBase64: base64 }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Échec de l'upload");
        }
        const data = await res.json();
        uploaded.push(data);
      }
      onChange(multiple ? [...images, ...uploaded] : uploaded);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Échec de l'upload — Cloudinary non configuré ? Voir README.md"
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-ash">
        {label}
      </label>
      <div className="flex flex-wrap gap-3">
        {images.map((img, i) => (
          <div key={img.publicId || i} className="relative h-20 w-20 border hairline">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(images.filter((_, idx) => idx !== i))}
              className="absolute -right-2 -top-2 rounded-full bg-signal p-1"
              aria-label="Retirer l'image"
            >
              <X className="h-3 w-3 text-ink" />
            </button>
          </div>
        ))}
        {(multiple || images.length === 0) && (
          <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 border hairline text-ash hover:border-signal hover:text-signal">
            <Upload className="h-4 w-4" />
            <span className="font-mono text-[9px] uppercase">
              {uploading ? "..." : "Ajouter"}
            </span>
            <input
              type="file"
              accept="image/*"
              multiple={multiple}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>
      {error && <p className="mt-2 text-xs text-signal">{error}</p>}
    </div>
  );
}
