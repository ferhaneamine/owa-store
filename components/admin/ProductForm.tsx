"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Product, ProductVariantStock } from "@/types";
import { collections as mockCollections } from "@/lib/mock-data";
import ImageUploader, { UploadedImage } from "@/components/admin/ImageUploader";

const CATEGORIES = [
  { value: "hoodie", label: "Hoodie" },
  { value: "tshirt", label: "T-Shirt" },
  { value: "pants", label: "Pantalon" },
  { value: "accessory", label: "Accessoire" },
];

const DEFAULT_SIZES: ProductVariantStock[] = [
  { size: "S", stock: 0 },
  { size: "M", stock: 0 },
  { size: "L", stock: 0 },
  { size: "XL", stock: 0 },
];

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [category, setCategory] = useState(product?.category ?? "hoodie");
  const [collectionSlug, setCollectionSlug] = useState(product?.collectionSlug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [colors, setColors] = useState(product?.colors.join(", ") ?? "Noir");
  const [sizes, setSizes] = useState<ProductVariantStock[]>(
    product?.sizes ?? DEFAULT_SIZES
  );
  const [images, setImages] = useState<UploadedImage[]>(product?.images ?? []);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [isNewArrival, setIsNewArrival] = useState(product?.isNewArrival ?? true);
  const [collectionOptions, setCollectionOptions] = useState(mockCollections);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/collections")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data.collections?.length) setCollectionOptions(data.collections);
      })
      .catch(() => {
        /* fall back to mock collections */
      });
  }, []);

  useEffect(() => {
    if (!isEdit) {
      setSlug(name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  }, [name, isEdit]);

  const updateSizeStock = (index: number, stock: number) => {
    setSizes((prev) => prev.map((s, i) => (i === index ? { ...s, stock: Math.max(0, stock) } : s)));
  };

  const updateSizeName = (index: number, size: string) => {
    setSizes((prev) => prev.map((s, i) => (i === index ? { ...s, size } : s)));
  };

  const addSize = () => setSizes((prev) => [...prev, { size: "", stock: 0 }]);
  const removeSize = (index: number) =>
    setSizes((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      slug,
      name,
      price: Number(price),
      category,
      collectionSlug,
      description,
      colors: colors.split(",").map((c) => c.trim()).filter(Boolean),
      sizes: sizes.filter((s) => s.size.trim()),
      images: images.map((img) => ({ ...img, alt: img.alt ?? name })),
      featured,
      isNewArrival,
      tags: [category],
    };

    try {
      const res = await fetch(
        isEdit ? `/api/products/${product!.slug}` : "/api/products",
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
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "MongoDB non configuré — voir README.md"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex max-w-2xl flex-col gap-6">
      <Field label="Nom du produit" value={name} onChange={setName} required />

      <div>
        <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-ash">
          Slug (URL)
        </label>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="w-full border hairline bg-transparent px-4 py-3 text-sm outline-none focus:border-signal"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Prix (DZD)" value={price} onChange={setPrice} type="number" required />
        <div>
          <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-ash">
            Catégorie
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Product["category"])}
            className="w-full border hairline bg-ink px-4 py-3 text-sm outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-ash">
          Catégorie / Collection produit
        </label>
        <select
          value={collectionSlug}
          onChange={(e) => setCollectionSlug(e.target.value)}
          required
          className="w-full border hairline bg-ink px-4 py-3 text-sm outline-none"
        >
          <option value="" disabled>Sélectionner</option>
          {collectionOptions.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      <Field label="Couleurs (séparées par une virgule)" value={colors} onChange={setColors} />

      <div>
        <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-ash">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full border hairline bg-transparent px-4 py-3 text-sm outline-none focus:border-signal"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="font-mono text-[11px] uppercase tracking-widest2 text-ash">
            Tailles &amp; stock
          </label>
          <button
            type="button"
            onClick={addSize}
            className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest2 text-signal"
          >
            <Plus className="h-3.5 w-3.5" /> Ajouter une taille
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {sizes.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                value={s.size}
                onChange={(e) => updateSizeName(i, e.target.value)}
                placeholder="Taille (S, M, L...)"
                className="w-28 border hairline bg-transparent px-3 py-2 text-sm outline-none focus:border-signal"
              />
              <input
                type="number"
                min={0}
                value={s.stock}
                onChange={(e) => updateSizeStock(i, Number(e.target.value))}
                placeholder="Stock"
                className="w-28 border hairline bg-transparent px-3 py-2 text-sm outline-none focus:border-signal"
              />
              <button
                type="button"
                onClick={() => removeSize(i)}
                aria-label="Retirer cette taille"
              >
                <Trash2 className="h-4 w-4 text-ash hover:text-signal" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <ImageUploader images={images} onChange={setImages} />

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          Mettre en avant (Best Sellers)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isNewArrival}
            onChange={(e) => setIsNewArrival(e.target.checked)}
          />
          Nouveauté
        </label>
      </div>

      {error && <p className="border hairline p-4 text-sm text-ash">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-signal py-4 font-mono text-xs uppercase tracking-widest2 text-ink hover:bg-bone hover:text-ink disabled:opacity-50"
      >
        {saving ? "Enregistrement..." : isEdit ? "Enregistrer les modifications" : "Créer le produit"}
      </button>
    </form>
  );
}

function Field({
  label, value, onChange, type = "text", required,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-ash">
        {label}
      </label>
      <input
        required={required}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border hairline bg-transparent px-4 py-3 text-sm outline-none focus:border-signal"
      />
    </div>
  );
}
