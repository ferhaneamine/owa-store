"use client";

import { useEffect, useState, use } from "react";
import { Collection } from "@/types";
import { getCollectionBySlug } from "@/lib/mock-data";
import CollectionForm from "@/components/admin/CollectionForm";

export default function EditCollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [collection, setCollection] = useState<Collection | null | undefined>(undefined);

  useEffect(() => {
    fetch(`/api/collections/${slug}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setCollection(data.collection))
      .catch(() => setCollection(getCollectionBySlug(slug) ?? null));
  }, [slug]);

  if (collection === undefined) {
    return <p className="text-sm text-ash">Chargement...</p>;
  }
  if (collection === null) {
    return <p className="text-sm text-ash">Catégorie introuvable.</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl uppercase">Modifier la catégorie</h1>
      <CollectionForm collection={collection} />
    </div>
  );
}
