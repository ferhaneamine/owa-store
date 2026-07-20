"use client";

import { useEffect, useState, use } from "react";
import { Product } from "@/types";
import { getProductBySlug } from "@/lib/mock-data";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null | undefined>(undefined);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setProduct(data.product))
      .catch(() => setProduct(getProductBySlug(slug) ?? null));
  }, [slug]);

  if (product === undefined) {
    return <p className="text-sm text-ash">Chargement...</p>;
  }
  if (product === null) {
    return <p className="text-sm text-ash">Produit introuvable.</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl uppercase">Modifier le produit</h1>
      <ProductForm product={product} />
    </div>
  );
}
