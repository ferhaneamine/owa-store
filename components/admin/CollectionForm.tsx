"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Collection } from "@/types";
import ImageUploader, { UploadedImage } from "@/components/admin/ImageUploader";

export default function CollectionForm({ collection }: { collection?: Collection }) {
  const router = useRouter();
  const isEdit = !!collection;

  const [name, setName] = useState(collection?.name ?? "");
  const [slug, setSlug] = useState(collection?.slug ?? "");
  const [tagline, setTagline] = useState(collection?.tagline ?? "");
  const [description, setDescription] = useState(collection?.description ?? "");
  const [order, setOrder] = useState(String(collection?.order ?? 0));
  const [coverImage, setCoverImage] = useState<UploadedImage[]>(
    collection?.coverImage?.url
      ? [{ url: collection.coverImage.url, publicId: collection.coverImage.publicId }]
      : []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!isEdit) {
      setSlug(value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name,
      slug,
      tagline,
      description,
      order: Number(order),
      coverImage: coverImage[0]
        ? { ...coverImage[0], alt: name }
        : { url: "", publicId: "", alt: name },
    };

    try {
      const res = await fetch(
        isEdit ? `/api/collections/${collection!.slug}` : "/api/collections",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Erreur lors de l'enregistrement");
      }
      router.push("/admin/collections");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "MongoDB non configuré — voir README.md"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex max-w-xl flex-col gap-6">
      <div>
        <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-ash">
          Nom
        </label>
        <input
          required
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full border hairline bg-transparent px-4 py-3 text-sm outline-none focus:border-signal"
        />
      </div>

      <div>
        <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-ash">
          Slug (URL)
        </label>
        <input
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full border hairline bg-transparent px-4 py-3 text-sm outline-none focus:border-signal"
        />
      </div>

      <div>
        <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-ash">
          Accroche
        </label>
        <input
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          className="w-full border hairline bg-transparent px-4 py-3 text-sm outline-none focus:border-signal"
        />
      </div>

      <div>
        <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-ash">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full border hairline bg-transparent px-4 py-3 text-sm outline-none focus:border-signal"
        />
      </div>

      <div>
        <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-ash">
          Ordre d&apos;affichage
        </label>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="w-32 border hairline bg-transparent px-4 py-3 text-sm outline-none focus:border-signal"
        />
      </div>

      <ImageUploader
        images={coverImage}
        onChange={setCoverImage}
        multiple={false}
        label="Image de couverture"
      />

      {error && <p className="border hairline p-4 text-sm text-ash">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-signal py-4 font-mono text-xs uppercase tracking-widest2 text-ink hover:bg-bone hover:text-ink disabled:opacity-50"
      >
        {saving ? "Enregistrement..." : isEdit ? "Enregistrer les modifications" : "Créer la catégorie"}
      </button>
    </form>
  );
}
