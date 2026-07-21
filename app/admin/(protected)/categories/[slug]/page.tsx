"use client";

import { use, useEffect, useState } from "react";
import { Category } from "@/types";
import { getCategoryBySlug } from "@/lib/mock-data";
import CategoryForm from "@/components/admin/CategoryForm";

export default function EditCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [category, setCategory] = useState<Category | null | undefined>(
    undefined
  );

  useEffect(() => {
    fetch(`/api/categories/${slug}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setCategory(data.category))
      .catch(() => setCategory(getCategoryBySlug(slug) ?? null));
  }, [slug]);

  if (category === undefined) {
    return <p className="text-sm text-ash">Chargement...</p>;
  }

  if (category === null) {
    return <p className="text-sm text-ash">Catégorie introuvable.</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl uppercase">
        Modifier la catégorie
      </h1>

      <CategoryForm category={category} />
    </div>
  );
}